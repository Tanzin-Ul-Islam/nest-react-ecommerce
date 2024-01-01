export function userTransformer(data: any) {
    const { password, otp, otpExpireyTime, isVerified, ...transformedData } = data._doc;
    return transformedData;
}