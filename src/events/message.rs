use twilight_model::gateway::payload::MessageCreate;
use twilight_http::Client as HttpClient;
use std::error::Error;

pub async fn message(msg: Box<MessageCreate>, http: HttpClient) -> Result<(), Box<dyn Error + Send + Sync>> {
    if msg.content == "!ping" {
        http.create_message(msg.channel_id).content("Pong!")?.await?;
    }
    
    Ok(())
}