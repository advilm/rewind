use rewind::s;

fn meta() -> (Vec<String>, String) {
    let names = vec!["ping", "p"];
    let description = "measures response time";

    (s(names), description.to_string())
}


async fn run(message: rewind::Message, client: rewind::Client) -> rewind::Res<()> {
    if message.content == "!ping" {
        client
            .create_message(message.channel_id)
            .content("Pong")?
            .await?;
    }

    Ok(())
}
