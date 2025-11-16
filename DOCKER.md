# 🐳 Docker Setup - Travel Agency App

## Quick Start (3 Steps)

### 1️⃣ Make sure you have `.env.local` file with all your keys

### 2️⃣ Open Docker Desktop

### 3️⃣ Run this command:
```powershell
docker-compose up
```

That's it! 🎉 Your app will be running at **http://localhost:3000**

---

## Common Commands

### Start the app
```powershell
docker-compose up
```

### Stop the app
```powershell
docker-compose down
```

### Rebuild after changes
```powershell
docker-compose up --build
```

### See logs
```powershell
docker-compose logs -f
```

---

## What's Happening?

1. Docker builds your React app
2. Loads all environment variables from `.env.local`
3. Starts the server on port 3000
4. You can access it in your browser!

---

## Troubleshooting

**App not starting?**
- Make sure Docker Desktop is running
- Check that `.env.local` file exists
- Run: `docker-compose logs` to see errors

**Port 3000 already in use?**
- Stop other apps using port 3000
- Or change port in `docker-compose.yml` to `"3001:3000"`

**Changes not showing?**
- Rebuild: `docker-compose up --build`
