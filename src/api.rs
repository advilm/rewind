#[allow(unused_imports)]
use actix_web::{get, web, App, HttpRequest, HttpServer};
use rewind::models::{Config, Query};
use qstring::QString;

#[get("/auth")]
async fn auth(req: HttpRequest, data: web::Data<Query>) -> String {
    data.code = Some(QString::from(req.query_string()).get("code").unwrap().to_string());
    let token = reqwest::Client::new()
        .post("https://discord.com/api/v9/oauth2/token")
        .body(serde_urlencoded::to_string(data).unwrap());

    let name = req.match_info().get("code").unwrap_or("World");
    format!("{}", name)
}

pub async fn run(config: Config, client: rewind::Client) -> std::io::Result<()> {
    let client_id = client.current_user().await.unwrap().id.to_string();

    let query = Query {
        client_id,
        client_secret: config.secret,
        grant_type: "authorization_code".to_string(),
        redirect_uri: "https://rewind.advil.cf/callback".to_string(),
        scope: "identify guilds".to_string(),
        code: Option::None,
    };

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(query.clone()))
            .service(auth)
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}