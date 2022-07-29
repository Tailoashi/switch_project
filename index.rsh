'reach 0.1';
const usersshared = {
    showtimeout: Fun([UInt], Null)
}
export const main = Reach.App(() => {
    const Alice = Participant('Alice', {
        ...usersshared,
        funds: Fun([], UInt),
        timeout: UInt,
        Alive: Fun([], UInt)
    })
    const Bob = Participant('Bob', {
        ...usersshared,
        acceptfunds: Fun([UInt], Null),
    })

    init()
    Alice.only(() => {
        const getfunds = declassify(interact.funds())
        const timeoutvalue = declassify(interact.timeout)
    })
    Alice.publish(getfunds, timeoutvalue)
        .pay(getfunds)
    commit()

    Bob.only(() => {
        const acceptfunds = declassify(interact.acceptfunds(getfunds))
    })
    Bob.publish(acceptfunds)
    const end = lastConsensusTime() + timeoutvalue
    var check_alive = 0
    invariant(balance() == getfunds)
    while (lastConsensusTime() <= end) {
        commit()
        Alice.only(() => {
            const getstate = declassify(interact.Alive())
        })
        Alice.publish(getstate)
        commit()
        each([Alice, Bob], () => {
            interact.showtimeout(timeoutvalue)
        })
        Alice.publish()
        check_alive = getstate
        continue
    }

    if (check_alive == 0) {
        transfer(balance()).to(Bob)
    } else {
        if (check_alive == 1) {
            transfer(balance()).to(Alice)
        } else {
            transfer(balance()).to(Alice)
        }
    }
    commit()

});
