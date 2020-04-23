# Timetableless

## Setup
```
npm install
npm run install:dynamodb
```

## Start all services locally
```
npm start
```

## Test
By default runs Unit and Integration Tests
```
npm t
```

Run only unit tests
```
npm run test:unit
```

Run only integration tests
```
npm run test:integration
```

Run only acceptance tests
```
npm run test:acceptance
```

## Deploy
setup aws credentials and then
```
npm run deploy
```

## Tail on function logs
You can find functionName in the `serverless.yml` file
```
npm run logs -- -f <functionName> -t
```

## TODO
- [ ] Cancellazione di una registrazione mediante link inviato via email
   - [x] completare i test di DeleteRegistrationAction
   - [x] fixare tests e usare set per peopleToNotify
   - [x] implementare RegistrationRepository.delete
   - [x] implementare deleteRegistrationEvent
   - [x] aggiungere link a delete registration ad ogni email
   - [x] fixare in dev l'errore Internal Sever Error
   - [x] (fatto da testare) dopo la cancellazione rimandare al frontend (magari con un messaggio: registrazione cancellata con successo)
   - [ ] testare handlers
- [ ] Migliorare interfaccia
    - [x] Autocompletamento della stazione (con ora di partenza e stazione + stazione di arrivo)
    - [-] Aggiungere spinner mentre fa la chiamata di registrazione
    - [x] Invece che Alert fare altro tipo di messaggio di successo
    - [x] Discriminare tra errore dati input errati e altro errore generico
    - [-] Aggiungere avviso che il servizio funziona solo con treni italiani con stazioni italiane
    - [x] Fare una grafica decente
    - [x] Trim spazi input
    - [x] Uniformare la lingua (tutto in italiano)
- [x] Diversi ambienti (dev)
- [x] Test accettazione se possibile quantomeno avvicinarsi
- [x] Pipeline
- [x] SES abilitato al mondo?
- [ ] Migliorare il readme
- [ ] Monitoring?

## Scenario
API viaggiatreno: https://github.com/bluviolin/TrainMonitor/wiki/API-del-sistema-Viaggiatreno

Come viaggiatore voglio poter essere notificato dal sistema a partire da un'ora prima della partenza teorica del treno e solo quando c'è una variazione nel ritardo.

Feature: notifica dei ritardi del treno

Scenario: treno in ritardo 1h prima della partenza
Dato: Alice registra per il treno X che prenderà alla stazione Y
Quando: Manca un ora alla partenza del treno
E: Il treno ha 5 minuti di ritardo
Allora: Alice riceve una notifica

Scenario: treno è in orario 1h prima della partenza
Dato: Alice registra per il treno X che prenderà alla stazione Y
Quando: Manca un ora alla partenza del treno
E: Il treno è in orario
Allora: Alice non riceve una notifica

Scenario: notifica quando varia il ritardo del treno nell ora precedente alla partenza
Dato: Alice registra per il treno X che prenderà alla stazione Y
Quando: manca mezzora alla partenza
E: il treno accumula un ritardo di 5 minuti
Allora: Alice riceve una notifica

- se il treno indicato dall'utente oggi è già passato il sistema dovrà assumere che la notifica andrà eseguita per il giorno successivo (verifichiamo che esista veramente il treno il giorno successivo)...
