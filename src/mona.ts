import { LocalStorage } from "./libs/localStorage"
import { Observable } from "./libs/observable"
import { AnimationResponse, InvalidBearerToken, InvalidWallet, MonaUser, OTPMIssingError, Token, TokenAnimatable } from "types"

export type MonaAPIProps = {
    /**
     * Mona API Key
     * Get your own key at https://studio.monaverse.com/
     */
    apiKey: string
    /**
     * Automatically login
     */
    autoLogin?: {
        /**
         * Automatically login user if refresh token has been saved locally
         */
        enabled: boolean
        /**
         * Callback when user is automatically logged in
         * @returns 
         */
        callbackOnLogin?: (refreshToken:MonaUser)=>void
        /**
         * the Key to store the refresh token in localStorage
         * @default 'x-mona-auth'
         */
        localStorageKey?: string
    }
}

export class MonaAPI {
    static key= ''
    static bearer=''
    static refreshToken = ''
    static localStorage:LocalStorage<string>;
    static autoLoginParams:MonaAPIProps['autoLogin'] = {
        enabled:false
    }

    private onRefreshToken = new Observable<{refreshToken:string}>()

    constructor({
        apiKey,
        autoLogin
    }:MonaAPIProps){
        if(!apiKey){
            throw new Error("MONA API Key is required")
        }
        MonaAPI.key = apiKey

        MonaAPI.autoLoginParams = autoLogin || MonaAPI.autoLoginParams

        MonaAPI.localStorage = new LocalStorage(autoLogin?.localStorageKey || 'x-mona-auth')

        this.onRefreshToken.add(this.automaticallyLogin)
    }

    automaticallyLogin = async ({refreshToken}:{refreshToken:string})=>{
        if(refreshToken && !MonaAPI.refreshToken){
            MonaAPI.refreshToken = refreshToken
            await this.OTP_Refresh()
            const user = await this.getUser()
            if('username' in user){
                MonaAPI.autoLoginParams?.callbackOnLogin && MonaAPI.autoLoginParams?.callbackOnLogin(user)
            }
        }
    }

    OTP_Generate = async (email:string) => {
        return await this._fetch<any>('https://api.monaverse.com/public/auth/otp/generate', {
            method: 'POST',
            body: JSON.stringify({email})
        })
    }

    OTP_Verify = async (email:string,otp:string) => {
        const isVerified= await this._fetch<{access:string,refresh:string}>('https://api.monaverse.com/public/auth/otp/verify', {
            method: 'POST',
            body: JSON.stringify({email,otp})
        })
        if('access' in isVerified){
            MonaAPI.bearer = isVerified.access
            MonaAPI.refreshToken = isVerified.refresh
            MonaAPI.localStorage.set(isVerified.refresh)
            this.onRefreshToken.notifyObservers({refreshToken:isVerified.refresh})
            return {success:true}
        }else {
            console.error(isVerified)
            return {success:false}
        }
    }

    OTP_Refresh = async () => {
        const isRefreshed= await this._fetch<{access:string,refresh:string}>('https://api.monaverse.com/public/auth/token/refresh', {
            method: 'POST',
            body: JSON.stringify({refresh:MonaAPI.refreshToken})
        })
        if('access' in isRefreshed){
            MonaAPI.bearer = isRefreshed.access
            MonaAPI.refreshToken = isRefreshed.refresh
            MonaAPI.localStorage.set(isRefreshed.refresh)
            this.onRefreshToken.notifyObservers({refreshToken:isRefreshed.refresh})
            return {success:true}
        }else {
            console.error(isRefreshed)
            return {success:false}
        }
    }

    getUser = async () => {
        const user = await this._fetch<MonaUser,InvalidBearerToken>('https://api.monaverse.com/public/user/',{
            method:'GET'
        })

        if('error' in user){
            return {error:'Could not get user'}
        }else{
            return user
        }
    }


    getTokens = async ({chain_id,address,queryKey}:{chain_id:number,address:string,queryKey?:string}) => {

        let url= `https://api.monaverse.com/public/user/${chain_id}/${address}/tokens?includeLastSale=false&includeAttributes=true`

        if(queryKey){
            url += `&continuation=${queryKey}`
        }

        const tokens = await this._fetch<{tokens:Token[],continuation:string|null},InvalidBearerToken>(url,{
            method:'GET'
        })

        if('error' in tokens){
            console.error(tokens)
            return {tokens:[] as TokenAnimatable[]}
        }else{
            const animatable = []
            for(const token of tokens.tokens){
                const animation = await this.getAnimation(token);
                if(animation){
                    (token as TokenAnimatable).animation = animation
                    animatable.push(token as TokenAnimatable)
                }
            }

            return {tokens:animatable,continuation:tokens.continuation}
        }
    }

    getAnimation = async (token:Token) => {
        const animation = await this._fetch<AnimationResponse,InvalidBearerToken>(`https://api.monaverse.com/public/tokens/${token.chainId}/${token.contract}/${token.tokenId}/animation`,{
            method:'GET'
        })

        if('error' in animation){
            console.error(animation)
            return null
        }else{
            return animation
        }
    }

    logout = () => {
        MonaAPI.bearer = ''
        MonaAPI.refreshToken = ''
        MonaAPI.localStorage.remove()
    }

    private _fetch = async <Data extends any,E extends OTPMIssingError | InvalidBearerToken | InvalidWallet = never>(url: string, options: RequestInit) => {
        const opt = {
            ...options,
            headers: {
                ...options.headers,
                'Content-Type': 'application/json',
                'X-Mona-Application-Id': MonaAPI.key,
                ...(MonaAPI.bearer?{Authorization:`Bearer ${MonaAPI.bearer}`}:{})
            }
        }
        try{
            const response = await fetch(url, opt)

            if(response.status === 400){
                const e = await response.text()
                return {error:e}
            }else if (response.status === 401){
                const e = await response.json() as E
                return {error:e}
            }
            return await response.json() as Data
        }catch(e){
            console.error(e)
            return {error:'Network Error'}
        }
    }
}

