use twilight_gateway::Event;

mod message;
mod shard_connect;

pub async fn handle_event(shard_id: u64, event: Event, client: rewind::Client) -> rewind::Res<()> {
    match event {
        Event::MessageCreate(msg) => message::message(msg, client).await?,
        Event::ShardConnected(_) => shard_connect::shard_connect(shard_id).await?,
        _ => {}
    }

    Ok(())
}
