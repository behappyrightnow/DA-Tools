# DA-Tools
Decision Analysis Forecasting Tools built with a FISHBROW architecture.

## What is FISHBROW architecture?
Decision support tools face a unique set of challenges in small and large enterprises that prevent agile deployment. They are:
 1. **Prohibitive Installation Costs:** Installation of any executable software is entirely controlled according to strict security regimes. It is very prohibitively expensive to get tiny tools iteratively deployed to be cleared by IT. 
 2. **Server Complexity:** For simple analyses that has a limited shelf-life, bringing servers into the mix, be they for web-hosting, or for data management is a big amount of complexity that does not provide commensurate value
 3. **Strategic Safety:** While the above two are general problems for any class of small tools, strategic safety is a particular challenge when it comes to decision support tools that aid with strategic decisions. Such tools often use inputs and outputs that are highly confidential to the organization. This often eliminates the usage of cloud-based tooling unless the need has been well-established and bought into by business stakeholders. Even if it is a small thought experiment, putting strategic information on someone else's infrastructure makes many business leaders nervous and thereby, avoid such experimentation.
 
 FISHBROW architecture is a response to the above concerns, and stands for FIle SHare deployment for BROWser-based apps. Such an architecture has the following desiderata:
 1. **No installation needed:** The final distribution is through a single html file, and works entirely inside the browser. It is therefore already compliant with the strictest of environments.
 2. **No webserver needed:** It html file will be distributed within the organization's file sharing solution following the rules of the security regime in place. For example, these files would live in a Google Drive folder or a Dropbox folder. Distribution would involve sharing a link to the file, and collaborators would have to open the file on their desktop in their browser.
 3. **No backend:** The file is designed to be self-contained, and is distributed with the relevant data embedded. This removes the need to talk to any database server.
 
 There are some additional considerations that one would want in such apps:
 1. **Interactive:** For those who cannot deal with code, such apps would allow basic manipulation of data and logic as relevant to the context.
 2. **Data in JSON:** For those who can handle a little bit of code, data will be provided in simple JSON formats and can be easily updated inside a text editor.

As one might guess, there is much emphasis on packaging to be able to produce a single html file. Thankfully, we have enough tooling in the open source ecosystem to be able to pull off a vision like this.

## The apps in this repository 
There are two apps currently in this repository. One is Curve, and the other is RevForecast. Curve is designed to help development teams forecast delivery dates with 90% certainty. RevForecast is designed to help delivery leaders understand the implications of their delivery plan on revenue.

## Get me started real quick
The easiest way to get started is to download the respective single html files in your browser and take them for a spin. The documentation for each application will show you how to do that.

 * Try [Curve](https://github.com/behappyrightnow/DA-Tools/tree/master/Curve)
 * Try [RevForecast](https://github.com/behappyrightnow/DA-Tools/tree/master/RevForecast)


 
 
