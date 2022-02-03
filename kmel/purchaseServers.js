export async function main(ns) {
    await ns.disableLog('ALL');

    const serverCostMulti = await ns.getPurchasedServerCost(16) / 16;
    const maxNumServers = await ns.getPurchasedServerLimit();
    const maxMoney = await ns.getServerMoneyAvailable('home') / maxNumServers;
    const maxRam = await ns.getPurchasedServerMaxRam('home');

    // get servers with the minimum, predefined amount, but check if there is already
    // a higher configured pserv
    var pServer = "";
    var ramToBuy = 16;

    // calculate max RAM for the buck
    if (maxMoney > serverCostMulti * ramToBuy) {
        ramToBuy *= 2;

        while (maxMoney > serverCostMulti * ramToBuy) {
            ramToBuy *= 2;
        }
        ramToBuy /= 2;
    }

    if (ramToBuy > maxRam) {
        ramToBuy = maxRam;
    }

    await ns.print('Calculated: ' + ramToBuy + ' GB RAM for ' + serverCostMulti * ramToBuy + '$');
    
    const serverCost = await ns.getPurchasedServerCost(ramToBuy);

    var i = 0;
    while (i < maxNumServers) {
        if (await ns.getServerMoneyAvailable("home") > serverCost) {
            if (!ns.serverExists('pserv-' + i) || await ns.getServerRam('pserv-' + i)[0] < ramToBuy) {
                //if (maxMoney > serverCostMulti * ramToBuy) {
                if (await ns.serverExists('pserv-' + i)) {
                    await ns.killall('pserv-' + i);
                    await ns.sleep(8000);
                    await ns.deleteServer('pserv-' + i);
                    await ns.sleep(5000);
                }

                if (!ns.serverExists('pserv-' + i)) {
                    pServer = await ns.purchaseServer('pserv-' + i, ramToBuy);
                    if (pServer) {

                        ns.print('Bought player server #' + i + ' with ' + ramToBuy + ' GB RAM for $' + serverCostMulti * ramToBuy);
                        ++i;
                    }
                }
                await ns.sleep(500);
            } else {
                ++i;
                await ns.sleep(500);
            }
        }
        await ns.sleep(500);
    }
}
