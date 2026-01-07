# ebade Demo Video Script
# Run with: vhs demo.tape
# Outputs: demo.gif + demo.mp4

# Outputs - both formats
Output demo.gif
Output demo.mp4

# Configuration
Set FontSize 20
Set Width 1200
Set Height 700
Set Theme "Catppuccin Mocha"
Set Padding 30
Set TypingSpeed 50ms
Set PlaybackSpeed 1.0

# Clear and prepare
Hide
Type "clear"
Enter
Sleep 500ms
Show

# Intro
Type "# 🧠 ebade - The Agent-First Framework"
Enter
Sleep 1.2s

Type "# Scaffold a full SaaS Dashboard in seconds..."
Enter
Sleep 1.5s

# The magic command with npx
Type "npx ebade scaffold examples/saas-dashboard.ebade.yaml ./output/demo"
Sleep 500ms
Enter

# Wait for CLI output (ASCII logo + spinners + summary)
Sleep 10s

# Show generated file
Type ""
Enter
Sleep 500ms

Type "head -12 output/demo/AnalyticsHQ/app/page.tsx"
Enter
Sleep 4s

# Final tagline
Type ""
Enter
Type "# ✅ 51 files. ~70% fewer tokens. In 0.1s."
Enter
Sleep 500ms
Type "# 🌱 Green AI. Kind to Earth."
Enter
Sleep 500ms
Type "# → ebade.dev"
Enter

Sleep 3s
