function scan(ns, parent, server, list) {
    const children = ns.scan(server);
    for (let child of children) {
        if (parent == child) {
            continue;
        }
        list.push(child);
        scan(ns, server, child, list);
    }
}

export function list_servers(ns) {
    const list = [];
    scan(ns, '', 'home', list);
    return list;
}

/** @param {NS} ns **/
export async function main(ns) {
    const args = ns.flags([["help", false]]);
    if (args.help) {
        ns.tprint("This script lists all servers on which you can run scripts.");
        ns.tprint(`Usage: run ${ns.getScriptName()}`);
        ns.tprint("Example:");
        ns.tprint(`> run ${ns.getScriptName()}`);
        return;
    }

    //    const servers = list_servers(ns).filter(s => ns.hasRootAccess(s)).concat(['home']);
    const servers = list_servers(ns);
    for (const server of servers) {
        const used = ns.getServerUsedRam(server);
        const max = ns.getServerMaxRam(server);
        const lvl = ns.getServerRequiredHackingLevel(server);
        ns.tprint(`${server} - ${used} GB / ${max} GB (${(100 * used / max).toFixed(2)}%) ${lvl} reqHackingLvl`);
        ns.brutessh(server);
        ns.ftpcrack(server);
        ns.relaysmtp(server);
        ns.httpworm(server);
        //ns.sqlinject(server);
        //ns.nuke(server);
        //ns.killall(server);
        ns.exec("deploy.js", "home", 1, server, "early-hack-template.js", "joesguns");
        await ns.sleep(500)
    }
    for (const server of servers) {
        //ns.exec("deploy.js", "home", 1, server, "early-hack-template.js", "rho-construction");
    }
}
