import JSZip from "jszip";
import * as vc from "vc-js";

import jsigs from 'jsonld-signatures';
import {contexts} from 'security-context';
import {RSAKeyPair, Ed25519KeyPair} from 'crypto-ld';
import documentLoaders from 'jsonld';
// import {credentialsv1, testCertificateContext, testCertificateContextUrl} from './credentials'
import { Observable, of } from "rxjs";
import { CsVerifyCertificateRequest } from "../../services/certificate";

type Primitive = string | number | boolean;

interface SortCriteria {
  [key: string]: 'asc' | 'desc' | SortComprehension;
}

interface SortComprehension {
  order: 'asc' | 'desc';
  preference?: Primitive[];
}


const urlPath = "/certificate";
const registerMemberLimit = 4;

const CERTIFICATE_CONTROLLER_ID =  'https://sunbird.org/';
const CERTIFICATE_NAMESPACE =  "https://cvstatus.icmr.gov.in/credentials/testCertificate/v1";
const CERTIFICATE_PUBKEY_ID =  'https://cvstatus.icmr.gov.in/i/india';
const CERTIFICATE_DID =  'did:india';
const CERTIFICATE_SCAN_TIMEOUT =  '45000';
const CERTIFICATE_SIGNED_KEY_TYPE =  'RSA';



export class CertificateVerifier {

    private static publicKey = '';

    public static getDataFromQr(req: CsVerifyCertificateRequest): Promise<any>{
        this.publicKey = req.publicKey;
        const zippedData = atob(req.scannedData.split('data=')[1]);
        const zip = new JSZip();
        return zip.loadAsync(zippedData).then((contents) => {
            console.log('after unzip', contents)
            return contents.files['certificate.json'].async('text')
          }).then( (contents) => {
            console.log('contents', contents);
            return this.verifyData(contents);
          }).catch(err => {
            console.log('error', err)
              }
          );
    }

    public static async verifyData(certificateData): Promise<any>{
        try {
            const signedJSON = JSON.parse(certificateData);
            const {AssertionProofPurpose} = jsigs.purposes;
            console.log('signedJSON', signedJSON)
            console.log('AssertionProofPurpose', AssertionProofPurpose)
            let result;
            // debugger
            console.log('in if')
            const publicKey = {
                '@context': jsigs.SECURITY_CONTEXT_URL,
                id: CERTIFICATE_DID,
                type: 'RsaVerificationKey2018',
                controller: CERTIFICATE_CONTROLLER_ID,
                publicKeyPem: this.publicKey
            };
            const controller = {
                '@context': jsigs.SECURITY_CONTEXT_URL,
                id: CERTIFICATE_CONTROLLER_ID,
                publicKey: [publicKey],
                // this authorizes this key to be used for making assertions
                assertionMethod: [publicKey.id]
            };
            const key = new RSAKeyPair({...publicKey});
            const {RsaSignature2018} = jsigs.suites;
            result = await jsigs.verify(signedJSON, {
                suite: new RsaSignature2018({key}),
                purpose: new AssertionProofPurpose({controller}),
                documentLoader: this.customLoader,
                compactProof: false
            });
            result.certificateData = signedJSON;
            console.log('result in csl', result)
            return result;
            
        } catch (e) {
            console.log('Invalid data', e);
            throw new Error('Invalid data');
        }
    }
    
    public static customLoader = url => {
        console.log("checking " + url);
        // const c = {
        //     "did:india": this.publicKey,
        //     "https://example.com/i/india": this.publicKey,
        //     "https://w3id.org/security/v1": contexts.get("https://w3id.org/security/v1"),
        //     'https://www.w3.org/2018/credentials#': credentialsv1,
        //     "https://www.w3.org/2018/credentials/v1": credentialsv1,
        //     [testCertificateContextUrl]: testCertificateContext,
        // };
        const c = {
            "did:india": this.publicKey,
            "https://example.com/i/india": this.publicKey,
            "https://w3id.org/security/v1": contexts.get("https://w3id.org/security/v1"),
        };
        let context = c[url];
        if (context === undefined) {
            console.log('context === undefined', contexts[url])
            context = contexts[url];
        }
        if (context !== undefined) {
            const c = {
                contextUrl: null,
                documentUrl: url,
                document: context
            };
            console.log('context !== undefined', c);
            return c;
    
        }
        if (url.startsWith("{")) {
            return JSON.parse(url);
        }
        console.log("Fallback url lookup for document :" + url)
        // Todo
        return documentLoaders({secure: false, strictSSL: false, request: 'request'})(url);
    };
  
}
