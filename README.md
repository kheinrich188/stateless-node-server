# Stateless Node Server

## Einleitung
Cloud Streaming ist heute ein großes Thema. Die Unreal Engine bietet ihren Kunden über das [Pixelstreaming](https://github.com/EpicGames/UnrealEngine/blob/release/Engine/Source/Programs/PixelStreaming/WebServers/SignallingWebServer) eine Möglichkeit in echtzeit ihre Inhalte aus der Cloud in einen Browser zu streamen. 

Dafür wird ein Matchmaking benötigt um User die eine Website aufrufen um aus der Cloud zu streamen mit einer jeweiligen Instanz in der Cloud zu verbinden.

Diese Matchmaking Anwendung ist hier eine NodeJS Anwendung. 

## Welche Probleme sind zu betrachten? 
- Die NodeJS Anwendung darf nicht statefull sein, da diese mehrfach deployed wird und hinter einem Load Balancer steht. Sie kann pro Region mehrfach existieren und sollte auch redundant stehen, falls es zu einem Ausfall kommt, dass ein anderer Node übernehmen kann. 
- Maximales Ausschöpfen der Resource. Konkret steht hier das Problem, das NodeJS Anwendungen prinzipiell nur auf einem Kern laufen. 
- Mehrere Aufgaben sind zu bedienen. Man möchte nicht nur User einer Cloud Instanz zuweisen, sondern auch ein Tracking betreiben (Wer ruft uns auf, wie lang und was hat er gestreamt ...). Ebenfalls möchten man anderen Abteilungen Instanzen zur Verfügung stellen, welche den Cloud Service ebenfalls nutzen wollen

## Installation
Installiere lokal eine PostgresDB. 
Am einfachsten geht das über: 
> https://postgresapp.com

Nachdem das Repository geklont wurde:
> `npm install`

Eventuell musst du den Port im 

Starte die Anwendung
> `npm run start`

Starten der lokalen Cloud Instanz
> `npm run start-cloud-instance`

Nun sollte in der Konsole eine Tabelle zu sehen sein in dem der Status deiner Instanz gehalten wird. 

## Ansatz
Die Herausforderung hier ist den Status der Anwendung konsistent zu halten. 

Als Datenbank habe ich mich für eine PostgresDB entschieden. 
In dem Beispiel können Cloud Instanzen simuliert werden über:
> `npm run start-cloud-instance`

Dies startet einen kleinen Server der versucht sich per Websocket mit unserem Matchmaker zu verbinden via `Websocket`.

Ähnlich ist dies auch in [Unreals Pixel Streaming](https://github.com/EpicGames/UnrealEngine/blob/release/Engine/Source/Programs/PixelStreaming/WebServers/SignallingWebServer/cirrus.js).
 
## Aktuell noch in progress 
Simulation eines Users der sich per Websocket am Matchmaker anmeldet.

Er fragt eine freie Instanz über eine HTTP Schnittstelle an und bekommt die IP-Adresse der Cloud Instanz. 

Mit der IP-Adresse, die der User bekommt, kann sich nun direkt mit der Instanz via `Websocket` verbinden.

Sobald das erfolgreich geklappt hat, meldet die Cloud Instanz nun via `sendClientConnectedToBay()`, dass sich ein Client mit ihr Verbunden hat. 

Alle befehle vom Client zum Steuern gehen über den Matchmaker, damit ein Tracking der Daten stattfinden kann, dafür benötigen wir noch eine generelle Schnittstelle die alles an die Cloud Instanz weiter leitet. 

Alle getrackten Daten sollten ebenfalls in einer Datenbank landen 

Testsetup welches mehrere Node Anwendungen hinter einem Load Balancer startet und auch mehrere Cloud Instanzen die sich dann verbinden wollen. 


