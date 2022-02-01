const filesToDownload = [
  '/util/util.js',
  '/single/grow.js',
  '/single/hack.js',
  '/single/weaken.js',
  'opti2.js',
 ]
const baseUrl = 'https://raw.githubusercontent.com/Oliver-Assenmacher/bitburner/'

/**
 * @param {NS} ns
 **/
export async function main(ns) {
  ns.disableLog("sleep")
  const args = ns.flags([['branch', 'main']])

  for ( let filename of filesToDownload ) {
    ns.scriptKill(filename, 'home')
    ns.rm(filename)
    await ns.sleep(50)
    await download(ns, filename, args.branch)
  }
  await ns.sleep(50)
  ns.tprint('Killed and deleted old scripts.')
  await ns.sleep(50)
  ns.tprint(`Files downloaded.`)

  await ns.sleep(50)
  ns.tprint(`Starting opti2.js`)
  ns.spawn('opti2.js', 1)
}

export async function download(ns, filename, branch) {
  const fileUrl = filename.includes("/") ? filename : "/" + filename;
  const path = baseUrl + branch + fileUrl
  ns.tprint(`Trying to download ${path}`)
  await ns.wget(path, filename)
}
