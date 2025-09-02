# MCP Football API Kurulum Kılavuzu

## Hızlı Kurulum

### 1. Projeyi Hazırlama

Proje zaten hazır durumda. Sadece bağımlılıkları yükleyip derlemek gerekiyor:

```bash
# Proje klasörüne git
cd /Users/basriayaz/Desktop/mcp_yeni/mcp-football-api

# Bağımlılıkları yükle (zaten yüklendi)
npm install

# Projeyi derle (zaten derlendi)
npm run build
```

### 2. Cursor IDE için Kurulum

1. Cursor IDE'yi açın
2. **Settings** → **MCP** bölümüne gidin (veya `Cmd+,` yapıp MCP arayın)
3. Aşağıdaki konfigürasyonu ekleyin:

```json
{
  "mcpServers": {
    "football-api": {
      "command": "node",
      "args": ["/Users/basriayaz/Desktop/mcp_yeni/mcp-football-api/dist/index.js"],
      "env": {
        "FOOTBALL_API_URL": "http://185.240.104.144"
      }
    }
  }
}
```

4. Cursor IDE'yi yeniden başlatın

### 3. Claude Desktop için Kurulum

Claude Desktop için konfigürasyon dosyasını doğru yere kopyalayın:

```bash
# macOS için
cp /Users/basriayaz/Desktop/mcp_yeni/mcp-football-api/claude_desktop_config.json ~/Library/Application\ Support/Claude/claude_desktop_config.json

# Veya mevcut konfigürasyona ekleyin
```

Claude Desktop'ı yeniden başlatın.

### 4. VS Code için Kurulum (Continue Extension)

Continue extension için `.continuerc.json` dosyasına ekleyin:

```json
{
  "customCommands": [
    {
      "name": "football-api",
      "command": "node /Users/basriayaz/Desktop/mcp_yeni/mcp-football-api/dist/index.js"
    }
  ]
}
```

## Test Etme

### Cursor veya Claude'da Test

Aşağıdaki komutları kullanarak test edebilirsiniz:

```
"Bugünkü maçları göster"
"Real Madrid ve Barcelona arasındaki maçı analiz et"
"123456 ID'li maç için value bet fırsatlarını göster"
"Premier League maçlarını listele"
"Manchester içeren takımları ara"
```

## Troubleshooting

### Sorun: MCP server görünmüyor

1. IDE'yi yeniden başlatın
2. Konfigürasyon dosyasının doğru yerde olduğundan emin olun
3. Node.js'in yüklü olduğundan emin olun: `node --version`

### Sorun: API bağlantı hatası

1. API sunucusunun çalıştığını kontrol edin: `curl http://185.240.104.144/api/v1/health`
2. İnternet bağlantınızı kontrol edin

### Sorun: Tool çalışmıyor

1. Proje klasörünün doğru path'de olduğundan emin olun
2. Build işleminin başarılı olduğundan emin olun: `npm run build`
3. `dist/index.js` dosyasının var olduğunu kontrol edin

## Güncel Tutma

Güncellemeler için:

```bash
cd /Users/basriayaz/Desktop/mcp_yeni/mcp-football-api
git pull # (eğer git repo ise)
npm install
npm run build
```

## Destek

Sorun yaşarsanız:
1. Console loglarını kontrol edin
2. API durumunu kontrol edin
3. Node.js ve npm versiyonlarını kontrol edin