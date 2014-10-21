#Paranoid Phobia

Are you concerned about our increasing lack of privacy online? Do you often transmit sensitive files over Facebook, Skype, Email and other insecure channels?

**Fear not!** Paranoid Phobia will secure your files before transmission, and allow secure key exchange with 3rd parties. 
Paranoid Phobia is a complete application, written entirely in Javascript and HTML (with a few lines of CSS). 

This means you can run it from it's folder sitting on your desktop. It requires no server and no data EVER leaves your machine. 

###How does it work?
It works using the following tools:

 - jQuery 2.1 (for the UI) 
 - CryptoJS v3.1.2 (for AES)
 - JSEncrypt (for RSA).
 - HTML5 FileReader API
 
We could probably have done without jQuery, but I doubt it will compromise the security as a local Javascript file.  
(feel free to make a rewrite without it).

There are some basic steps to sending a file with Paranoid Phobia.

 1. The **receiving** party creates a new identity. It's only stored in RAM, so the tab will need to remain open.
 2. The **receiving** party sends the provided public message key to the **sending** party. This can be through any insecure channel.
 3. The **sending** party inputs the key, chooses a file and encrypts it. It will automatically download the encrypted file to the **sending** partys disk. The filename is chosen at random and always end in ".paranoid".
 4. The **sending** party will now send the file over any insecure connection. 
 5. The **receiving** party will choose the encrypted file, and click "Decrypt", and it will automatically download the unencrypted file to his own harddrive, with it's original filename.
 6. Profit?!? (And some confused NSA workers).
 
As soon as the receiving party closes his tab, the encrypted file is lost forever. Please note that the download of the files is handled entirely in HTML using Javascript, meaning **no data ever leaves your machine**. 


###How does it really work? Like, technically?!

When the receiving party creates a new identity, we use JSEncrypt to create a completely **random RSA-2048 Key-pair**, and store the private key in a variable, and the public part in the textbox for easy copy/pasting. This key is sent to the sending party.

On the sending party, we generate a random 128 character string, for use as an AES256 key.
We read the entire chosen file into memory (therefore the filesize limit) and encrypt it using this randomly created password.

Afterwards, we encrypt the random 128 character string, using the **public key** of the receiving party, and _prepend_ it the encrypted file data. Please note that right after this, we also store the encrypted filename, encrypted using the same public key. We use two custom delimiters to seperate all this encrypted data (more on that in a moment).

When the receiving file load this encrypted file, we will try to find our two delimiters, and throw an error if they aren't found (meaning it's not a file we made). We will split the data up, and use our own private RSA key (the one stored in RAM from the key-pair we made in the beginning), to decrypt the 128 character AES key, and also decrypt the filename.

We use the decrypted AES key to decrypt the true file data, and we download it to the receivings partys machine, using the filename we also have decrypted.

The file encrypted format is as follows:

```
(RSA ENCRYPTED AES KEY) + "|_PARANOIDPHOBIA_|" + (RSA ENCRYPTED FILE NAME) + "|_THETHREATISREAL_|" + (THE AES ENCRYPTED FILE DATA)
```

As you can see, we won't even leak the filename of the file, during transmission. The only information leakage which might occur, is the filesize. This might be mitigated in a future version.

###I took at look: Your code is a mess!
I don't care. Take it or leave it. I mostly code PHP (Laravel, and following best practives as by Brandon Savages book). This was a fun little project completed in 4 hours total and will likely never get cleaned up.

###How secure is this?
Depends on how you use it and who you are protecting yourself against. If you are protecting yourself against the NSA, good luck. They will install hardware keyloggers, infect this while you are downloading it, or maybe just drug you and beat you with a wrench. You are screwed no matter what! 

Still tho, it will make it extremely hard for them to get your data, provided that RSA 2048 still holds (it should until 2030), and AES256 isn't broken yet. (and also the Javascript implementations have no flaws, but it's widely used OpenSource libraries so we hope not).

I also recommend running this from your own machine, by just opening the HTML file, or at the very least over HTTPS if you got to server it on the internet. Otherwise any third party may tamper with the source code and make the system save raw files, or even just send them the data.

I'd say it's reasonably secure. 

###WAIT!!! What about MiTM attacks?
There. You did it. You made me think of [Michael Jackson](https://www.youtube.com/watch?v=pEQAie8ABLE). 

Anyway, it's true that this application is vulnerable, as it has no chain of trust and can't validate the person in the other end, is who he claims to be. You can mitigate this by exchanging the public messaging key over something that is hard to tamper, or maybe over two different realtime-services at the same time, to make it insanely hard to tamper with both of them. 

But yeah, an attacker could _potentially_ intercept the public key, generate his own, and pass it on the sending party, intercept the encrypted file back, decrypt it using his own key, and re-encrypt it using the original public key. That could not be detected, and the file would be compromised without anybody even knowing. 

As I said before, try and mix it up! Send the public key through one channel, and send it through another (at random), just sothe sending party can compare them. And then get the encrypted file back through a third channel!

###Why don't you just use OpenSSL or FancyXYZ?
Cause it's complicated. This is simple. It's a ZIP file you download, keep around, and use when needed. It's pressing buttons and copy pasting stuff. Nothing crazy. If you don't like it, use whatever you want. I actually advise you to use different tools, and encrypt the files multiple times, to layer the security.


###Sooo... is this ready for business purposes and backed by an 100% security guarantee?
Nope. Not even close! I won't and can't be help responsible for any problems, damage or leaked information, arising from trusting this software.
It's free to use, free to modify and free to do with whatever you want. Just don't blame me when the entire companys secrets are leaked all over the place.

I use it myself, and wrote it for my own needs. I trust that this software is as secure as I could make it, but I won't be held responsible if it's not up to the task.

ALSO: 
#Don't EVER risk your life. Exchange sensitive material offline. Nothing digital can be trusted these days!!!#
Cybercriminals and NSA are everywhere. Trust nobody. Not even me.