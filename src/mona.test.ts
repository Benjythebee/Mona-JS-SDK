import { expect, test } from 'vitest'
import MonaAPI from '.'
const monaAPI = import.meta.env.VITE_MONA_APP_ID

const mona = new MonaAPI({
    apiKey:monaAPI,
    autoLogin:{
        enabled:true,
        callbackOnLogin:()=>{}
    }
})


test('Object is not undefined', () => {
    expect(mona).toBeDefined()
  })

/**
 * TODO: 
 * - Add more tests; However that's only doable with a TEST API KEY and maybe a TEST EMAIL & Account
 */