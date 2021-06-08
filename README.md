## Usage

```TypeScript
import TypedEventEmitter from "typed-event-emitter";

class MyClass extends TypedEventEmitter<{ init: never; ready: boolean }> {
    constructor() {
        super();
        this.emit("init");
        this.emit("ready", true);
    }
}
```