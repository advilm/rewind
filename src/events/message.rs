use twilight_http::Client as HttpClient;
use twilight_model::gateway::payload::MessageCreate;

pub async fn message(msg: Box<MessageCreate>, http: HttpClient) -> rewind::Res<()> {
    if msg.content == "!ping" {
        http.create_message(msg.channel_id)
            .content("Pong!")?
            .await?;
    }

    Ok(())
}
