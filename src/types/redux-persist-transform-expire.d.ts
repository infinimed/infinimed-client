declare module 'redux-persist-transform-expire' {
  import { Transform } from 'redux-persist';
  
  interface ExpireConfig {
    /** Key to identify the expiration time in the persisted state */
    expireKey?: string;
    /** Default state to return when expired */
    defaultState?: any;
    /** Key to store the time when persisted */
    persistedAtKey?: string;
    /** Seconds after which state should expire */
    expireSeconds: number;
  }

  export default function createExpirationTransform(config: ExpireConfig): Transform;
}
