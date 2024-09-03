# Javascript Wrapper around the Monaverse API

A wrapper written in typescript that wraps around [the Monaverse API](https://monaverse.readme.io/reference/getting-started-2);

## How to use:

1. Install with `npm i mona-js-sdk`
2. Instance the `Mona` class and use it as you want;

**Instancing**:

```typescript
const Mona = new MonaAPI({
  apiKey: api,
  autoLogin: {
    enabled: true,
    callbackOnLogin: setUser
  }
});
export default Mona;
```

**Generate one time password**:

```typescript
await Mona.OTP_Generate('my@email.com');
```

Note that `OTP_Generate` will always resolve (unless the api key is wrong) for security reasons.

**Verify One time password**:

```typescript
const p = await Mona.OTP_Verify('my@email.com', 123123);
if (p.success) {
        ...
}
```

**Get User** :

```typescript
const user = await Mona.getUser();
console.log(user) 
> {
    wallets: ['0x0fa074262d6af...'],
    email: 'my@email.com',
    username: 'fayelure',
    name: 'Fayelure'
  };
```

## Dev

1. Git clone the repo;
2. Run `npm i`

### Contributing

Create a new branch and push your changes, make sure `npm run build` still works. Then make a PR;
