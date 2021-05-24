use std::fs;

pub fn collect() -> rewind::Res<()> {
    for entry in fs::read_dir("src/commands").unwrap() {
        let entry = entry?;
        if !entry.file_type()?.is_file() {
            rewind::modtest!(format!("src/commands/{}", entry.file_name().to_string_lossy()));
        }
    }

    Ok(())
}
