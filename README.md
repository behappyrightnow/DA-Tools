# DA-Tools
Decision Analysis Forecasting Tools built with a FISH architecture.

## What is a FISH architecture?
Decision support tools face a unique set of challenges in small and large enterprises that prevent agile deployment. They are:
 1. **Prohibitive Installation Costs:** Installation of any executable software is entirely controlled according to strict security regimes. It is very prohibitively expensive to get tiny tools iteratively deployed to be cleared by IT. 
 2. **Server Complexity:** For simple analyses that has a limited shelf-life, bringing servers into the mix, be they for web-hosting, or for data management is a big amount of complexity that does not provide commensurate value
 3. **Strategic Safety:** While the above two are general problems for any class of small tools, strategic safety is a particular challenge when it comes to decision support tools that aid with strategic decisions. Such tools often use inputs and outputs that are highly confidential to the organization. This often eliminates the usage of cloud-based tooling unless the need has been well-established and bought into by business stakeholders. Even if it is a small thought experiment, putting strategic information on someone else's infrastructure makes many business leaders nervous and thereby, avoid such experimentation.
 
 FISH architecture is a response to the above concerns, and each letter stands for: **F**ileshared **I**nline **S**ingle page application **H**tml:
 1. **Fileshared:** The distribution mechanism is not through an internal or external webserver, but the organization's approved filesharing solution (e.g. Google Drive, Dropbox or Box).
 2. **Inline:** The distributed tool will be a single file with all data and libraries inlined in the code.
 3. **Single-page application:** The application will follow the architecture of single-page applications where all of the logic is within a single client-side page.
 4. **Html**: The file will have the html format which is generally allowed in all organizations and can be directly opened through a standard web browser.

As one might guess, there is much emphasis on packaging to be able to produce a single html file. Thankfully, we have enough tooling in the open source ecosystem to be able to pull off a vision like this.

## The apps in this repository 
There are two apps currently in this repository. One is Curve, and the other is RevForecast. Curve is designed to help development teams forecast delivery dates with 90% certainty. RevForecast is designed to help delivery leaders understand the implications of their delivery plan on revenue.

## Get me started real quick
The easiest way to get started is to download the respective single html files in your browser and take them for a spin. The documentation for each application will show you how to do that.

 * Try [Curve](https://github.com/behappyrightnow/DA-Tools/tree/master/Curve)
 * Try [RevForecast](https://github.com/behappyrightnow/DA-Tools/tree/master/RevForecast)


 
 
