```shell
firebase emulators:start --only functions,auth,firestore,storage
```

```shell
export GOOGLE_APPLICATION_CREDENTIALS="tmp/key.json"
```

```shell
firebase deploy --only functions 
```

```shell
firebase deploy --only storage
```