---
title: Minecraft internals
description: A brief overview of how to use internals in your plugin.
slug: paper/dev/internals
---

The code that runs Minecraft is not open source. Bukkit is an API that allows plugins to interact with the server. This
is implemented by CraftBukkit and interacts with Minecraft's code. You will often hear the terms NMS and CraftBukkit
when talking about Minecraft internals.

:::danger[Using Minecraft Internals]

Using Minecraft internals is not recommended. This is because using internal code directly is not guaranteed to be
stable and it changes often. This means that your plugin may break when a new version of Minecraft is released.
Whenever possible, you should use API instead of internals.

**PaperMC will offer no direct support for programming against Minecraft internals.**

:::

## What is NMS?

NMS stands for `net.minecraft.server` and refers to a Java package that contains a lot of Mojang's code. This code is
proprietary and is not open source. This code is not guaranteed to be stable when invoked externally and may change at
any time.

## Accessing Minecraft Internals

In order to use Mojang and CraftBukkit code, you may either use the `paperweight-userdev` Gradle plugin or use reflection.
[`paperweight-userdev`](https://github.com/PaperMC/paperweight-test-plugin) is the recommended way to access internal code
as it is easier to use due to being able to have the remapped code in your IDE. You can find
out more about this in the [`paperweight-userdev`](/paper/dev/userdev) section.

However, if you are unable to use `paperweight-userdev`, you can use reflection.

### Reflection

Reflection is a way to access code at runtime. This allows you to access code that may not be available at compile time.
Reflection is often used to access internal code across multiple versions. However, reflection does come
with performance impacts if used improperly. For example, if you are accessing a method or field more than once,
you should cache the [`Field`](jd:java:java.lang.reflect.Field)/
[`Method`](jd:java:java.lang.reflect.Method) to prevent the performance
impact of looking up the field/method each time.

The internal CraftBukkit code is relocated to `org.bukkit.craftbukkit.<version>` unless you run a Mojang-mapped version
of Paper. This is unlikely to be the case in most production environments. This means that any attempts to reflect must
include the version. For example, `org.bukkit.craftbukkit.v1_20_R2.CraftServer` is the full class and package name
for the CraftServer class in version 1.20.2. You can access these classes easily with some reflection utilities.

:::caution[Removal of relocation in 1.20.5]

As of 1.20.5, the versioned relocation of the CraftBukkit package was removed and
CraftBukkit packages are now located in `org.bukkit.craftbukkit` and not in `org.bukkit.craftbukkit.<version>`.

:::

```java
private static final String CRAFTBUKKIT_PACKAGE = Bukkit.getServer().getClass().getPackageName();

public static String cbClass(String clazz) {
  return CRAFTBUKKIT_PACKAGE + "." + clazz;
}

// You can then use this method to get the CraftBukkit class:
Class.forName(cbClass("entity.CraftBee"));
```

Minecraft's code is obfuscated. This means that the names of classes and methods are changed to make them harder to
understand. Paper deobfuscates these identifiers for development; however, to provide compatibility with legacy plugins,
Paper is re-obfuscated at runtime. You can use a library like [reflection-remapper](https://github.com/jpenilla/reflection-remapper) to automatically remap the
reflection references. This will allow you to use the de-obfuscated, Mojang-mapped, names in your code. This is recommended as
it makes the code easier to understand.

### Mojang-Mapped Servers

:::note[Mojang-mapped runtime as of 1.20.5]

As of 1.20.5, Paper ships with a Mojang-mapped runtime instead of reobfuscating the server to Spigot mappings.
For more information, see the [plugin remapping](/paper/dev/project-setup#plugin-remapping) section and [userdev](/paper/dev/userdev#1205-and-beyond) documentation covering these changes.

:::

Running a Mojang-Mapped (moj-map) server is an excellent way to streamline your processes because you can develop using
the same mappings that will be present at runtime. This eliminates the need for remapping in your compilation. If you
are creating custom plugins for your server, we highly recommend running a moj-map server. It simplifies debugging and
allows you to hotswap plugins.

In the future, the Paper server will no longer undergo remapping. By adopting Mojang mappings now, you can ensure that
your plugin won't require internal remapping when we make the switch.

### Getting the current Minecraft version

You can get the current Minecraft version to allow you to use the correct code for a specific version. This can be done
with one of the following methods:

```java replace
// Example value: \{LATEST_PAPER_RELEASE}
String minecraftVersion = Bukkit.getServer().getMinecraftVersion();

// Example value: \{LATEST_PAPER_RELEASE}-R0.1-SNAPSHOT
String bukkitVersion = Bukkit.getServer().getBukkitVersion();

// Example value for 1.20.1: 3465
int dataVersion = Bukkit.getUnsafe().getDataVersion();
```

:::danger[Parsing the version]

Parsing the version from the package name of classes is no longer possible as of 1.20.5 as Paper stopped relocating the CraftBukkit package.
See the [reflection](#reflection) section for more information.

:::
