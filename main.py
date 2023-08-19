import sys
import asyncio

from bscpylgtv import WebOsClient
from bscpylgtv import endpoints as ep

# call this command like:
# python3 main.py <host> <command> <optional params>

#HOST = "192.168.20.23"
# client key will be retrieved on first run and stored in sqlite DB
CLIENT_KEY = None
HOST = sys.argv[1]
cmd = sys.argv[2]
params = ' '.join(sys.argv[3:])
print(params)


async def main():
    client = WebOsClient(HOST, CLIENT_KEY)
    await client.async_init()
    await client.connect()

    # Store this key for future use
    print(f"Client key: {client.client_key}")

    if cmd == 'set_input':
        input = params
        return await client.request(ep.SET_INPUT, {"inputId": input})

    elif cmd == 'turn_screen_off':
        return await client.request(getattr(ep, "TURN_OFF_SCREEN"), {"standbyMode": "active"})

    elif cmd == 'turn_screen_on':
        return await client.request(getattr(ep, "TURN_ON_SCREEN"), {"standbyMode": "active"})

    elif cmd == 'button':
        message = f"type:button\nname:{params}\n\n"
        await client.input_command(message)

    elif cmd == 'take_screenshot':
        return await client.request(ep.TAKE_SCREENSHOT, {"method": "DISPLAY", "format": "JPG", "width": 1920, "height": 1080, "path": ""})


if __name__ == "__main__":
    response = asyncio.run(main())
    print(response)
