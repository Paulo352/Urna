class CryptoUtils {
    static async generateKeyPair() {
        return await window.crypto.subtle.generateKey(
            {
                name: "RSA-OAEP",
                modulusLength: 4096,
                publicExponent: new Uint8Array([1, 0, 1]),
                hash: "SHA-256"
            },
            true,
            ["encrypt", "decrypt"]
        );
    }

    static async encryptVote(vote, publicKey) {
        const encoder = new TextEncoder();
        const encoded = encoder.encode(JSON.stringify(vote));
        
        return await window.crypto.subtle.encrypt(
            { name: "RSA-OAEP" },
            publicKey,
            encoded
        );
    }

    static async decryptVote(encryptedVote, privateKey) {
        try {
            const decrypted = await window.crypto.subtle.decrypt(
                { name: "RSA-OAEP" },
                privateKey,
                encryptedVote
            );
            
            const decoder = new TextDecoder();
            return JSON.parse(decoder.decode(decrypted));
        } catch (error) {
            console.error("Decryption error:", error);
            return null;
        }
    }

    static async hashVoterId(voterId) {
        const encoder = new TextEncoder();
        const data = encoder.encode(voterId + "SALT_SECURE_123");
        
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
}