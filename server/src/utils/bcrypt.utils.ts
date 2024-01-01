import * as bcrypt from 'bcrypt';

async function genSalt() {
    return await bcrypt.genSalt(10);
}

export async function hashPassword(password: string) {
    const saltOrRounds = await genSalt();
    const hash = await bcrypt.hashSync(password, saltOrRounds);
    return hash;
}

export async function compareHash(password: string, hashPass: string) {
    const compare = await bcrypt.compareSync(password, hashPass);
    return compare;
}