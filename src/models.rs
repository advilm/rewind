use serde::{Deserialize, Serialize};

#[derive(Serialize, Clone)]
pub struct Query {
    pub client_id: String,
    pub client_secret: String,
    pub grant_type: String,
    pub redirect_uri: String,
    pub scope: String,
    pub code: Option<String>,
}

#[derive(Deserialize, Clone)]
#[allow(dead_code)]
pub struct Config {
    pub token: String,
    pub devs: Vec<String>,
    pub secret: String,
    pub port: u16,
}
