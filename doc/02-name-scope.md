# Programming Basics

## State When Running Code

Core concepts

- Program State (what values are in variables?)
- Variable Namespace (where to look up names)

### Example And Explanation

```js
let i = 0;
console.log(i); // 0
{
    console.log(i); // undefined --> why ?
    let i = 1;
    console.log(i); // 1
}
```
