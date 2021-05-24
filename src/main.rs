use futures::stream::StreamExt;

use serde_derive::Deserialize;

use twilight_cache_inmemory::{InMemoryCache, ResourceType};
use twilight_gateway::cluster::{Cluster, ShardScheme};

use twilight_model::gateway::Intents;

mod commands;
mod events;
#[derive(Deserialize)]
struct Config {
    token: String,
    devs: Vec<String>,
}

#[tokio::main]
async fn main() -> rewind::Res<()> {
    commands::collect();

    let contents = std::fs::read_to_string("config.toml").expect("Failed to read config.toml");
    let config: Config = toml::from_str(&contents).expect("Failed to parse config.toml contents");

    let scheme = ShardScheme::Auto;

    let cluster = Cluster::builder(&config.token, Intents::GUILD_MESSAGES)
        .shard_scheme(scheme)
        .build()
        .await?;

    let cluster_spawn = cluster.clone();

    tokio::spawn(async move {
        cluster_spawn.up().await;
    });

    let client = rewind::Client::new(&config.token);

    let cache = InMemoryCache::builder()
        .resource_types(ResourceType::MESSAGE)
        .build();

    let mut events = cluster.events();

    while let Some((shard_id, event)) = events.next().await {
        cache.update(&event);

        tokio::spawn(events::handle_event(shard_id, event, client.clone()));
    }

    Ok(())
}
