use anyhow::Result;
use serde::{Deserialize, Serialize};
use std::path::PathBuf;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Config {
    pub editor: EditorConfig,
    pub ui: UiConfig,
    pub ai: AiConfig,
    pub keybindings: KeybindingsConfig,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EditorConfig {
    pub font_family: String,
    pub font_size: f32,
    pub tab_size: usize,
    pub line_numbers: bool,
    pub word_wrap: bool,
    pub auto_save: bool,
    pub cursor_blink: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UiConfig {
    pub theme: String,
    pub transparency: f32,
    pub animations: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AiConfig {
    pub provider: String,
    pub model: String,
    pub api_key: Option<String>,
    pub auto_complete: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct KeybindingsConfig {
    pub save: String,
    pub open: String,
    pub find: String,
    pub command_palette: String,
}

impl Default for Config {
    fn default() -> Self {
        Self {
            editor: EditorConfig {
                font_family: "JetBrains Mono".to_string(),
                font_size: 14.0,
                tab_size: 4,
                line_numbers: true,
                word_wrap: false,
                auto_save: true,
                cursor_blink: true,
            },
            ui: UiConfig {
                theme: "dark".to_string(),
                transparency: 1.0,
                animations: true,
            },
            ai: AiConfig {
                provider: "gemini".to_string(),
                model: "gemini-pro".to_string(),
                api_key: None,
                auto_complete: true,
            },
            keybindings: KeybindingsConfig {
                save: "Ctrl+S".to_string(),
                open: "Ctrl+O".to_string(),
                find: "Ctrl+F".to_string(),
                command_palette: "Ctrl+Shift+P".to_string(),
            },
        }
    }
}

impl Config {
    pub fn load() -> Result<Self> {
        let config_path = Self::config_path()?;

        if config_path.exists() {
            let content = std::fs::read_to_string(&config_path)?;
            let config: Config = toml::from_str(&content)?;
            Ok(config)
        } else {
            let config = Config::default();
            config.save()?;
            Ok(config)
        }
    }

    pub fn save(&self) -> Result<()> {
        let config_path = Self::config_path()?;

        if let Some(parent) = config_path.parent() {
            std::fs::create_dir_all(parent)?;
        }

        let content = toml::to_string_pretty(self)?;
        std::fs::write(config_path, content)?;

        Ok(())
    }

    fn config_path() -> Result<PathBuf> {
        let config_dir = dirs::config_dir()
            .ok_or_else(|| anyhow::anyhow!("Could not find config directory"))?;
        Ok(config_dir.join("nexus").join("config.toml"))
    }
}

// Add dirs crate to Cargo.toml for cross-platform config paths
