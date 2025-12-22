```shell
firebase emulators:start --only functions,auth,firestore
```

```shell
export GOOGLE_APPLICATION_CREDENTIALS="tmp/key.json"
```

```shell
firebase deploy --only functions 
```