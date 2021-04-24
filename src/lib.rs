pub type Res<T> = Result<T, Box<dyn std::error::Error + Send + Sync>>;

pub use twilight_model::gateway::payload::MessageCreate as Message;
pub use twilight_http::Client;

pub struct Command {
    pub names: Vec<String>,
    pub description: String,
    pub run: fn(Message, Client) -> Res<()>,
}

pub fn s(vector: Vec<&str>) -> Vec<String> {
    let mut v: Vec<String> = Vec::new();
    for i in &vector {
        v.push(i.to_string())
    }
    v
}