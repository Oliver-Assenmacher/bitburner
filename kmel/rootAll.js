export async function main(ns) {
    await ns.clear("nukedServers.txt");

    const myHackLevel = await ns.getHackingLevel();
    var bestTargetIndex = 1;
    var bestTargetScore = 0;
    const rows = await ns.read("servers.txt").split("\r\n");

    const portBusters = ['BruteSSH.exe', 'FTPCrack.exe', 'relaySMTP.exe', 'HTTPWorm.exe', 'SQLInject.exe'];
    var numBusters = 0;
    for (let i = 0; i < portBusters.length; i++) {
        if (await ns.fileExists(portBusters[i], "home")) {
            await ns.tprint(portBusters[i] + " exists");
            ++numBusters;
        } else {
            await ns.tprint(portBusters[i] + " missing");
        }
    }


    for (let i = 0; i < rows.length; ++i) {
        var serverData = rows[i].split(',');
        if (serverData.length < 7) break; //Ignore last blank row

        var svName = serverData[0];
        // refresh target-data, in case an old file has been read
        var svRamAvail = await ns.getServerRam(svName)[0];
        var svPortsNeeded = await ns.getServerNumPortsRequired(svName);
        var svHackLevel = await ns.getServerRequiredHackingLevel(svName);

        if (!(ns.hasRootAccess(svName)) &&
            (numBusters >= svPortsNeeded) &&
            (myHackLevel >= svHackLevel)) {

            if (ns.fileExists('BruteSSH.exe')) await ns.brutessh(svName);
            if (ns.fileExists('FTPCrack.exe')) await ns.ftpcrack(svName);
            if (ns.fileExists('relaySMTP.exe')) await ns.relaysmtp(svName);
            if (ns.fileExists('HTTPWorm.exe')) await ns.httpworm(svName);
            if (ns.fileExists('SQLInject.exe')) await ns.sqlinject(svName);
            await ns.nuke(svName);
            await ns.tprint(svName + " nuked!");
        }

        if (await ns.hasRootAccess(svName)) {
            var svMaxMoney = await ns.getServerMaxMoney(svName);
            var svMinSec = await ns.getServerMinSecurityLevel(svName);
            var svGrowRt = await ns.getServerGrowth(svName);
            var svExecTime = await ns.getHackTime(svName);
            var svScore = (100 - (svMinSec * 1.5)) * svMaxMoney * svGrowRt / svExecTime;

            if (svScore > bestTargetScore) {
                bestTargetScore = svScore;
                bestTargetIndex = i;
            }
            if (svRamAvail > 8 && svMaxMoney > 0) {
                await ns.write("nukedServers.txt", svName + ",");
            }
        }

        await ns.sleep(100);
    }
    await ns.write("best_target.txt", rows[bestTargetIndex], "w");
    await ns.tprint("Best target:" + rows[bestTargetIndex]);
    
    var runNextScript = await ns.prompt("Do you want to update the nuked Servers?");
    if (runNextScript) {
        await ns.run("7_updateServers.ns");
    }
}
