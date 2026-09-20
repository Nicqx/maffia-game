# Maffia-játék asszisztens

Mobilbarát, böngészőből használható Maffia-játékvezető asszisztens.

## NUC telepítés és frissítés

Előfeltétel: Docker, Git, Bash, működő k3s, `redis-service` és ingress.

```bash
cd ~/codes/maffia-game
git pull --ff-only
KUBECTL='sudo k3s kubectl' ./update.sh --target nuc --dry-run
KUBECTL='sudo k3s kubectl' ./update.sh --target nuc
```

Erőforrások: `maffia-game` Deployment, `maffia-game-service:8098`; publikus útvonal `/maffia/`. Manifestmentések: `~/.local/state/nicqx-apps/nuc/maffia-game/`.

```bash
sudo k3s kubectl get pod,service -n default -l app=maffia-game -o wide
sudo k3s kubectl logs deployment/maffia-game -n default --tail=50
curl -fsS https://pmqxyz.hopto.org/maffia/api/healthz
```

## Migráció, rollback és eltávolítás

A konténer állapotmentes; a sessionök a közös Redisben vannak (6 órás TTL). Előbb a `redis` repo eljárásával migráld az adatokat, utána futtasd az update-et. Külön PVC nincs.

```bash
sudo k3s kubectl scale deployment/maffia-game -n default --replicas=0
sudo k3s kubectl scale deployment/maffia-game -n default --replicas=1
sudo k3s kubectl apply -f /teljes/ut/korabbi-manifest.yaml
sudo k3s kubectl rollout status deployment/maffia-game -n default --timeout=180s
sudo k3s kubectl delete deployment/maffia-game service/maffia-game-service -n default
```

Az eltávolítás nem töröl Redis-adatot vagy ingress-szabályt.

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
