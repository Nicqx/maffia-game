# Maffia-játék asszisztens

Mobilbarát, böngészőből használható Maffia-játékvezető asszisztens.

## Funkciók

- automatikus 5 számjegyű session kód
- minimum 6 aktív játékos + 1 játékvezető
- több kör egy sessionben
- játékvezető körbeadása ülési sorrend szerint
- rejtett/felfedhető szerepkártya játékosonként
- többnyelvű frontend: hu/en/de
- Redis-alapú session tárolás, 6 órás TTL
- TTL reset gomb játékvezetőnek
- játékmesteri instrukciók
- védett maffiózó első lekérdezés jelölése
- Testőr és Sárika néni éjszakai céljelölők
- „Senki nem halt meg” esemény
- kör végi szerepfelfedés és összesítő

## Lokális futtatás

Redis szükséges:

```bash
docker run --rm -p 6379:6379 redis:7-alpine
```

Alkalmazás:

```bash
npm install
PORT=8098 BASE_PATH=/maffia REDIS_URL=redis://localhost:6379 npm start
```

Megnyitás:

```text
http://localhost:8098/maffia/
```

## Docker build

```bash
docker build --no-cache -t maffia-game:latest .
docker save maffia-game:latest -o maffia-game.tar
sudo k3s ctr image import maffia-game.tar
```

## Kubernetes telepítés

```bash
kubectl apply -k k8s/
kubectl rollout status deployment/maffia-game
```

Várható URL:

```text
https://pmqxyz.hopto.org/maffia/
```

Redis service elvárt neve:

```text
redis://redis-service:6379
```
