import fetch from "cross-fetch"
import Promise from "bluebird"

export interface mitLicense {
    copyright: string | Array<string | object> | object;
    url?:       string;
    email?:     string;
    theme?:     string;
    gravatar?:  boolean;
    format?:    string;
    license?:   string;
}

export function createMITLicense(name: string, params: mitLicense) {
    return new Promise((resolve, reject) => {
        fetch(`https://${name}.mit-license.org`, {
            method: 'POST',
            body: params
        })
            .then(res => res.text())
            .then(res => {
                if (/MIT license page created: https:\/\/.+\.mit-license\.org/.test(res)) resolve({
                    code: 201,
                    message: res
                })
                else if (res === `JSON requires "copyright" property and value`) reject({
                    code: 400,
                    message: res
                })
                else if (res === "Please specify a subdomain in the URL.") reject({
                    code: 400,
                    message: res
                })
                else if (res === "User already exists - to update values, please send a pull request on https://github.com/remy/mit-license") reject({
                    code: 409,
                    message: res
                })
                else if (res === "Unable to create new user - please send a pull request on https://github.com/remy/mit-license") reject({
                    code: 502,
                    message: res
                })
            })
    })
}
