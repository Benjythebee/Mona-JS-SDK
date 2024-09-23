
/**
 * Class to manage the local storage for a specific key
 */
export class LocalStorage<T extends any> {
    key: string
    /**
     * Map used for nodeJS environment
     */
    nodeJsMap:Map<string,T>|null = null
    constructor(key: string) {
        this.key = key

        this.nodeJsMap = new Map()
    }

    isBrowser = () => typeof window !== 'undefined'
    /**
     * Get the value of the key from local storage
     */
    get = () => {
        if(!this.isBrowser()){
            return this.nodeJsMap!.get(this.key) as T|undefined
        }

        const item = localStorage.getItem(this.key)
        if(!item){
            return null
        }
        // check if item is a JSON string
        try {
            return JSON.parse(item) as T
        } catch (error) {}

        // handle non JSON string
        return item as T
    }
    /**
     * Set the value of the key in local storage
     */
    set = (value: T) => {
        if(!this.isBrowser()){
             this.nodeJsMap!.set(this.key,value)
             return
        }
        localStorage.setItem(this.key, typeof value =='string'?value:JSON.stringify(value))
    }
    /**
     * Remove the key from local storage
     */
    remove = () => {
        if(!this.isBrowser()){
            this.nodeJsMap!.delete(this.key)
            return
        }
        localStorage.removeItem(this.key)
    }

}