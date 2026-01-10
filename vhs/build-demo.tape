# ebade v0.4.6 Build Demo
# Run with: vhs vhs/build-demo.tape

Output ../assets/build-demo.gif
Output ../assets/build-demo.mp4

Set FontSize 20
Set Width 1200
Set Height 800
Set Theme "Catppuccin Mocha"
Set Padding 40
Set TypingSpeed 60ms

# Start fresh
Hide
Type "rm -rf LuxuryConcierge"
Enter
Type "clear"
Enter
Sleep 500ms
Show

# Step 1: The Prompt
Type "# 🛡️ Phase I: The Offline Architect"
Enter
Sleep 1s
Type "# Designing a project with 0 tokens using NPX..."
Enter
Sleep 1.5s

# The magic command using npx
Type "npx ebade build 'A luxury concierge service with pricing, testimonials and a gold theme'"
Sleep 500ms
Enter

# Wait for the Architect to work (Creative Brief output)
Sleep 15s

# Step 2: Show the result
Type "# ✅ Project designed and scaffolded in seconds."
Enter
Sleep 1.5s
Type "ls -R LuxuryConcierge/app"
Enter
Sleep 4s

# Final tagline
Type "# 🌓 ebade: Hybrid Workflow."
Enter
Sleep 1s
Type "# → Get started at ebade.dev"
Enter

Sleep 4s
