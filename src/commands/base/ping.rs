use rewind::{Command, s};

fn construct() -> Command {
    Command {
        names: s(vec!["ping", "p"]),
        description: "Sends pong".into(),
        run: run,
    }
}

async fn run(message: rewind::Message, client: rewind::Client) -> rewind::Res<()> {
    if message.content == "!ping" {
        client
            .create_message(message.channel_id)
            .content("Pong!")?
            .await?;
    }
    
    Ok(())
}