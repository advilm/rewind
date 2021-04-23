use twilight_gateway::Event;
use twilight_http::Client as HttpClient;

mod message;
mod shard_connect;

pub async fn handle_event(shard_id: u64, event: Event, http: HttpClient) -> rewind::Res<()> {
    match event {
        Event::MessageCreate(msg) => message::message(msg, http).await?,
        Event::ShardConnected(_) => shard_connect::shard_connect(shard_id).await?,
        _ => {}
    }

    Ok(())
}
