pub mod models;

pub type Res<T> = Result<T, Box<dyn std::error::Error + Send + Sync>>;

pub use twilight_http::Client;
pub use twilight_model::gateway::payload::MessageCreate as Message;

use futures::Future;
use std::pin::Pin;

pub type FutureResult = Pin<Box<dyn Future<Output = Res<()>>>>;

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

// #[macro_export]
// macro_rules! modtest {
//     ( $( $x:expr ),* ) => {
//         {
//             let mut temp_vec = Vec::new();
//             $(
//                 for entry in std::fs::read_dir($x)? {
//                     let entry = entry?;
//                     let path = std::path::Path::new(&entry.file_name());

                    
//                     println!("{:?}", entry);
//                 }
//                 temp_vec.push($x);
//             )*
//             temp_vec
//         }
//     };
// }


// fn source_file_names<P: AsRef<Path>>(dir: P) -> Result<Vec<String>> {
//     let mut names = Vec::new();
//     let mut failures = Vec::new();

//     for entry in fs::read_dir(dir)? {
//         let entry = entry?;
//         if !entry.file_type()?.is_file() {
//             continue;
//         }

//         let file_name = entry.file_name();
//         if file_name == "mod.rs" || file_name == "lib.rs" || file_name == "main.rs" {
//             continue;
//         }

//         let path = Path::new(&file_name);
//         if path.extension() == Some(OsStr::new("rs")) {
//             match file_name.into_string() {
//                 Ok(mut utf8) => {
//                     utf8.truncate(utf8.len() - ".rs".len());
//                     names.push(utf8);
//                 }
//                 Err(non_utf8) => {
//                     failures.push(non_utf8);
//                 }
//             }
//         }
//     }