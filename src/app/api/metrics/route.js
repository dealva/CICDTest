import { NextResponse } from "next/server";

export async function GET() {
    return new NextResponse(
        await global.instrument.metrics(),
        {
            headers:{
                'Content-Type': global.instrument.contentType
            }
        }
    ) 
}