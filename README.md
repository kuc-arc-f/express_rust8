# express_rust8

 Version: 0.9.2

 date    : 2026/08/11

 update : 2026/08/13

***

node Express + Rust , HTMX TODO

* json file save
* Tailwindcss
* rustc 1.97.1 
* node 22
* Linux

***
## Image

![img1](/images/express_rust8_2.png)

***
### related

https://htmx.org/

***
* Rust LIB build
```
cargo build --release
```

***
* node start
```
npm i
npm run start
```

***
* test-code
* add

```
 curl -X POST -H "Content-Type: application/json" \
 -d '{"title": "test-data-001"}' \
 http://localhost:3000/api/todo/create
```

* list
```
curl http://localhost:3000/api/todo/list
```

***
### version

* V_0_9_1: new

***