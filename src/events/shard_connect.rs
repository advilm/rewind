pub async fn shard_connect(shard_id: u64) -> rewind::Res<()> {
    println!("Connected on shard {}", shard_id);

    Ok(())
}
