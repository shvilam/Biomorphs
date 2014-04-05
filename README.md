**Biomorphs**
=========

Javascript implementation of Richard Dawkins' famous Biomorphs. 
More info about Richard Dawkins' famous Biomorphs can be found here. [here](https://www.google.com/search?q=Biomorphs+can+be+found+here&oq=Biomorphs+can+be+found+here&aqs=chrome..69i57.340j0j4&sourceid=chrome&espv=210&es_sm=119&ie=UTF-8#q=biomorphs+richard+dawkins). 

My Colorful implementation
![ScreenShot](/ScreenShot.png)


## Technologies Using

Client Side
- Javascript
- Canavs 
- jquriy
- History.js https://github.com/browserstate/history.js/

I haven't used any MVC framework even that Backbone.js could because be perfect but I thought that it a part ot the exercise to do the implementation myself.


Serever
- nodejs
- express
- nodegit http://www.nodegit.org/



**Rquriments** 

Apart form the obvious ones. You will have to create a git repository one level up from your server folder.


	
## Using Git as DB
I have chosen to save the stats of the different Biomorph in git for easy way to diff the file.
I think that the 2 concept going together great because both of them are build to save incremental changes.
the intailse concept was
created branches for each run so when you will go over the commit it will make more scene.

**The cons** of this nice idea is scalability this implementation could not scale at all.
Mainly because the changes on the local file can run over each other and the git process can be locked by other processes.

## Solving the scalablity issue 
It can be solve some quite easily with using sql base db, like mysql each Biomorph will have a key and each Biomorph will be have it own row.
It can even scale it using nosql db like mongo.

Both changes could be done quite easily.

## What is missing 
There is few thing that are missing mainly because it only written as a concept project and not a real one and as always shortage of time.
- test there is not implementation of Unit test or any other test at all. 
- no error handling 




