export async function main(ns) {
    var servers = ["home"];
    await ns.clear("servers.txt");
    for (let i = 0; i < servers.length; ++i) {
        var hostname = servers[i];
        await ns.print(hostname + " logged.");
        await ns.write("servers.txt", hostname +
            "," + await ns.getServerRam(hostname)[0] +
            "," + await ns.getServerNumPortsRequired(hostname) +
            "," + await ns.getServerRequiredHackingLevel(hostname) +
            "," + await ns.getServerMaxMoney(hostname) +
            "," + await ns.getServerMinSecurityLevel(hostname) +
            "," + await ns.getServerGrowth(hostname) +
            "\r\n");

        var newScan = await ns.scan(hostname);
        for (let j = 0; j < newScan.length; j++) {
            if (servers.indexOf(newScan[j]) == -1) {
                servers.push(newScan[j]);
            }
        }
    }
    await ns.tprint("Network mapped with " + servers.length + " servers.");
}
