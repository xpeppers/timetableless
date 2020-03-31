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
- [ ] Chiudere il giro (magari un interfaccia decente)
- [x] Diversi ambienti (dev)
- [ ] Test accettazione se possibile quantomeno avvicinarsi
- [x] Pipeline
- [] SES abilitato al mondo?
    - [x] template differenti per Dev e Pro
    - [] alla registrazione dell'utente se non è già registrato inviare verifica email
         - [] TODO: implementare VerificationService
    - [] ? Capire come trovare gli indirizzi già registrati su SES
- [ ] Monitoring?

## Create Custome verification email template
```
aws ses create-custom-verification-email-template --cli-input-json file://email-templates/verification-dev.json --profile xpeppers-develop --region eu-west-1
```

## Verify an email
```
aws ses send-custom-verification-email --email-address <email> --template-name TimetablelessTemplateDev --profile xpeppers-develop --region eu-west-1
```

## Check email verification progress

```
aws ses get-identity-verification-attributes --identities "<email>" --profile xpeppers-develop --region eu-west-1
```

Response:

```json
{"VerificationAttributes":{"<email>":{"VerificationStatus":"Success"}}}
```

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
