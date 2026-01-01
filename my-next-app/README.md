
![HomeAutomation](https://github.com/user-attachments/assets/de01bad8-057f-4c11-bcea-a74cd66fdf1d)

## Opis sistema

Osnovni nadzorni sistem doma omogoča spremljanje temperature in vlage znotraj in zunaj. Dodatno beleži porabo električne energije celotne hiše. Vsi podatki se shranjujejo v podatkovno bazo InfluxDB in se prikazujejo s pomočjo platforme Grafana. Projekt temelji na uporabi naprav Arduino (ESP32) in Raspberry Pi ter ustreznih senzorjev. Za prikaz podatkov skrbi spletni vmesnik, kjer so na voljo meritve v realnem času in zgodovina meritev.

### ESP32 + Si7021 (vlažnost & temperatura)

- **Napajanje:** 18650 Li-ion baterija  
- **Senzor:** Si7021  
- **Krmilnik:** ESP32 DevKit  

**Delovanje:** Periodično meri temperaturo in vlažnost ter pošilja podatke prek WiFi v InfluxDB.

**Source code:**  
- [FireB_Sensor](https://github.com/TianCimerman/FireB_Sensor)

### Raspberry Pi 5 – Backend (InfluxDB, Grafana, spletni strežnik)

- Sprejema podatke iz ESP32 in jih shranjuje v InfluxDB.  
- Vizualizira podatke s pomočjo Grafana dashboarda.  
- Gosti spletno stran z dashboardom.

**Source code:**  
- [Dashboard_react](https://github.com/TianCimerman/Dashboard_react)  
- [SolarEdge-ModBusRead](https://github.com/TianCimerman/SolarEdge-ModBusRead)

### Raspberry Pi – prikaz v "Kiosk načinu"

- V dnevni sobi prikazuje trenutno temperaturo, vlažnost in porabo energije.  
- Frontend je narejen v Reactu.  
- Deluje v Raspberry Pi "Kiosk Mode" (Chromium v celozaslonskem načinu, samodejni zagon ob zagonu sistema).

---

### ESP32 + Si7021 (Humidity & Temperature Sensor)

- **Power Supply:** 18650 Li-ion battery  
- **Sensor:** Si7021  
- **Microcontroller:** ESP32 DevKit  

**Function:** Periodically measures temperature and humidity and sends the data via WiFi to InfluxDB.

**Source code:**  
- [FireB_Sensor](https://github.com/TianCimerman/FireB_Sensor)

### Raspberry Pi 5 – Backend (InfluxDB, Grafana, Web Server)

- Receives data from the ESP32 and stores it in InfluxDB.  
- Visualizes data using Grafana dashboards.  
- Hosts a web server that serves the dashboard frontend.

**Source code:**  
- [Dashboard_react](https://github.com/TianCimerman/Dashboard_react)  
- [SolarEdge-ModBusRead](https://github.com/TianCimerman/SolarEdge-ModBusRead)

### Raspberry Pi – Kiosk Mode Display

- Displays current temperature, humidity, and energy consumption in the living room.  
- Frontend built using React.  
- Runs in "Kiosk Mode" (Chromium in fullscreen, auto-start on boot).

## Screenshots
![Posnetek zaslona 2025-06-06 190523](https://github.com/user-attachments/assets/5522a99f-e2dc-422a-ab2e-43e6a8b9701e)
![Posnetek zaslona 2025-06-06 185259](https://github.com/user-attachments/assets/44c208c0-7b24-4b7c-9a1f-c85066c4adec)

