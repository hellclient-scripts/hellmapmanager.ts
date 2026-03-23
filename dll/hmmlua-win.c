#ifdef _WIN32
#include "windows.h"
#define symLoad GetProcAddress
#else
#include "dlfcn.h"
#define symLoad dlsym
#endif

#ifdef _WIN32
HINSTANCE handle;
#else
void *handle;
#endif

#include <lua.h>
#include <lauxlib.h>
#include <lualib.h>


char *(*c_version)(char *input, int encoding);
char *(*c_import)(char *input, int encoding);
char *(*c_export)(char *input, int encoding);
char *(*c_create)(char *input, int encoding);
char *(*c_close)(char *input, int encoding);
char *(*c_info)(char *input, int encoding);
char *(*c_listrooms)(char *input, int encoding);
char *(*c_removerooms)(char *input, int encoding);
char *(*c_insertrooms)(char *input, int encoding);
char *(*c_listmarkers)(char *input, int encoding);
char *(*c_insertmarkers)(char *input, int encoding);
char *(*c_removemarkers)(char *input, int encoding);
char *(*c_listroutes)(char *input, int encoding);
char *(*c_removeroutes)(char *input, int encoding);
char *(*c_insertroutes)(char *input, int encoding);
char *(*c_listtraces)(char *input, int encoding);
char *(*c_removetraces)(char *input, int encoding);
char *(*c_inserttraces)(char *input, int encoding);
char *(*c_listregions)(char *input, int encoding);
char *(*c_removeregions)(char *input, int encoding);
char *(*c_insertregions)(char *input, int encoding);
char *(*c_listshortcuts)(char *input, int encoding);
char *(*c_removeshortcuts)(char *input, int encoding);
char *(*c_insertshortcuts)(char *input, int encoding);
char *(*c_listvariables)(char *input, int encoding);
char *(*c_removevariables)(char *input, int encoding);
char *(*c_insertvariables)(char *input, int encoding);
char *(*c_listlandmarks)(char *input, int encoding);
char *(*c_removelandmarks)(char *input, int encoding);
char *(*c_insertlandmarks)(char *input, int encoding);
char *(*c_listsnapshots)(char *input, int encoding);
char *(*c_removesnapshots)(char *input, int encoding);
char *(*c_insertsnapshots)(char *input, int encoding);
char *(*c_querypathany)(char *input, int encoding);
char *(*c_querypathall)(char *input, int encoding);
char *(*c_querypathordered)(char *input, int encoding);
char *(*c_dilate)(char *input, int encoding);
char *(*c_trackexit)(char *input, int encoding);
char *(*c_getvariable)(char *input, int encoding);
char *(*c_queryregionrooms)(char *input, int encoding);
char *(*c_getroom)(char *input, int encoding);
char *(*c_clearsnapshots)(char *input, int encoding);
char *(*c_takesnapshot)(char *input, int encoding);
char *(*c_searchsnapshots)(char *input, int encoding);
char *(*c_searchrooms)(char *input, int encoding);
char *(*c_filterrooms)(char *input, int encoding);
char *(*c_grouproom)(char *input, int encoding);
char *(*c_tagroom)(char *input, int encoding);
char *(*c_setroomdata)(char *input, int encoding);
char *(*c_tracelocation)(char *input, int encoding);
char *(*c_getroomexits)(char *input, int encoding);

static int
l_version(lua_State *L)
{
    const char *input = luaL_checkstring(L, 1);
    int encoding = luaL_checkinteger(L, 2);
    char *result = c_version((char *)input, encoding);
    lua_pushstring(L, result);
    return 1;
}

static int
l_import(lua_State *L)
{
    const char *input = luaL_checkstring(L, 1);
    int encoding = luaL_checkinteger(L, 2);
    char *result = c_import((char *)input, encoding);
    lua_pushstring(L, result);
    return 1;
}

static int
l_export(lua_State *L)
{
    const char *input = luaL_checkstring(L, 1);
    int encoding = luaL_checkinteger(L, 2);
    char *result = c_export((char *)input, encoding);
    lua_pushstring(L, result);
    return 1;
}

static int
l_create(lua_State *L)
{
    const char *input = luaL_checkstring(L, 1);
    int encoding = luaL_checkinteger(L, 2);
    char *result = c_create((char *)input, encoding);
    lua_pushstring(L, result);
    return 1;
}

static int
l_close(lua_State *L)
{
    const char *input = luaL_checkstring(L, 1);
    int encoding = luaL_checkinteger(L, 2);
    char *result = c_close((char *)input, encoding);
    lua_pushstring(L, result);
    return 1;
}

static int
l_info(lua_State *L)
{
    const char *input = luaL_checkstring(L, 1);
    int encoding = luaL_checkinteger(L, 2);
    char *result = c_info((char *)input, encoding);
    lua_pushstring(L, result);
    return 1;
}

static int
l_listrooms(lua_State *L)
{
    const char *input = luaL_checkstring(L, 1);
    int encoding = luaL_checkinteger(L, 2);
    char *result = c_listrooms((char *)input, encoding);
    lua_pushstring(L, result);
    return 1;
}

static int
l_removerooms(lua_State *L)
{
    const char *input = luaL_checkstring(L, 1);
    int encoding = luaL_checkinteger(L, 2);
    char *result = c_removerooms((char *)input, encoding);
    lua_pushstring(L, result);
    return 1;
}

static int
l_insertrooms(lua_State *L)
{
    const char *input = luaL_checkstring(L, 1);
    int encoding = luaL_checkinteger(L, 2);
    char *result = c_insertrooms((char *)input, encoding);
    lua_pushstring(L, result);
    return 1;
}

static int
l_listmarkers(lua_State *L)
{
    const char *input = luaL_checkstring(L, 1);
    int encoding = luaL_checkinteger(L, 2);
    char *result = c_listmarkers((char *)input, encoding);
    lua_pushstring(L, result);
    return 1;
}

static int
l_insertmarkers(lua_State *L)
{
    const char *input = luaL_checkstring(L, 1);
    int encoding = luaL_checkinteger(L, 2);
    char *result = c_insertmarkers((char *)input, encoding);
    lua_pushstring(L, result);
    return 1;
}

static int
l_removemarkers(lua_State *L)
{
    const char *input = luaL_checkstring(L, 1);
    int encoding = luaL_checkinteger(L, 2);
    char *result = c_removemarkers((char *)input, encoding);
    lua_pushstring(L, result);
    return 1;
}

static int
l_listroutes(lua_State *L)
{
    const char *input = luaL_checkstring(L, 1);
    int encoding = luaL_checkinteger(L, 2);
    char *result = c_listroutes((char *)input, encoding);
    lua_pushstring(L, result);
    return 1;
}

static int
l_removeroutes(lua_State *L)
{
    const char *input = luaL_checkstring(L, 1);
    int encoding = luaL_checkinteger(L, 2);
    char *result = c_removeroutes((char *)input, encoding);
    lua_pushstring(L, result);
    return 1;
}

static int
l_insertroutes(lua_State *L)
{
    const char *input = luaL_checkstring(L, 1);
    int encoding = luaL_checkinteger(L, 2);
    char *result = c_insertroutes((char *)input, encoding);
    lua_pushstring(L, result);
    return 1;
}

static int
l_listtraces(lua_State *L)
{
    const char *input = luaL_checkstring(L, 1);
    int encoding = luaL_checkinteger(L, 2);
    char *result = c_listtraces((char *)input, encoding);
    lua_pushstring(L, result);
    return 1;
}

static int
l_removetraces(lua_State *L)
{
    const char *input = luaL_checkstring(L, 1);
    int encoding = luaL_checkinteger(L, 2);
    char *result = c_removetraces((char *)input, encoding);
    lua_pushstring(L, result);
    return 1;
}

static int
l_inserttraces(lua_State *L)
{
    const char *input = luaL_checkstring(L, 1);
    int encoding = luaL_checkinteger(L, 2);
    char *result = c_inserttraces((char *)input, encoding);
    lua_pushstring(L, result);
    return 1;
}

static int
l_listregions(lua_State *L)
{
    const char *input = luaL_checkstring(L, 1);
    int encoding = luaL_checkinteger(L, 2);
    char *result = c_listregions((char *)input, encoding);
    lua_pushstring(L, result);
    return 1;
}

static int
l_removeregions(lua_State *L)
{
    const char *input = luaL_checkstring(L, 1);
    int encoding = luaL_checkinteger(L, 2);
    char *result = c_removeregions((char *)input, encoding);
    lua_pushstring(L, result);
    return 1;
}

static int
l_insertregions(lua_State *L)
{
    const char *input = luaL_checkstring(L, 1);
    int encoding = luaL_checkinteger(L, 2);
    char *result = c_insertregions((char *)input, encoding);
    lua_pushstring(L, result);
    return 1;
}

static int
l_listshortcuts(lua_State *L)
{
    const char *input = luaL_checkstring(L, 1);
    int encoding = luaL_checkinteger(L, 2);
    char *result = c_listshortcuts((char *)input, encoding);
    lua_pushstring(L, result);
    return 1;
}

static int
l_removeshortcuts(lua_State *L)
{
    const char *input = luaL_checkstring(L, 1);
    int encoding = luaL_checkinteger(L, 2);
    char *result = c_removeshortcuts((char *)input, encoding);
    lua_pushstring(L, result);
    return 1;
}

static int
l_insertshortcuts(lua_State *L)
{
    const char *input = luaL_checkstring(L, 1);
    int encoding = luaL_checkinteger(L, 2);
    char *result = c_insertshortcuts((char *)input, encoding);
    lua_pushstring(L, result);
    return 1;
}

static int
l_listvariables(lua_State *L)
{
    const char *input = luaL_checkstring(L, 1);
    int encoding = luaL_checkinteger(L, 2);
    char *result = c_listvariables((char *)input, encoding);
    lua_pushstring(L, result);
    return 1;
}

static int
l_removevariables(lua_State *L)
{
    const char *input = luaL_checkstring(L, 1);
    int encoding = luaL_checkinteger(L, 2);
    char *result = c_removevariables((char *)input, encoding);
    lua_pushstring(L, result);
    return 1;
}

static int
l_insertvariables(lua_State *L)
{
    const char *input = luaL_checkstring(L, 1);
    int encoding = luaL_checkinteger(L, 2);
    char *result = c_insertvariables((char *)input, encoding);
    lua_pushstring(L, result);
    return 1;
}

static int
l_listlandmarks(lua_State *L)
{
    const char *input = luaL_checkstring(L, 1);
    int encoding = luaL_checkinteger(L, 2);
    char *result = c_listlandmarks((char *)input, encoding);
    lua_pushstring(L, result);
    return 1;
}

static int
l_removelandmarks(lua_State *L)
{
    const char *input = luaL_checkstring(L, 1);
    int encoding = luaL_checkinteger(L, 2);
    char *result = c_removelandmarks((char *)input, encoding);
    lua_pushstring(L, result);
    return 1;
}

static int
l_insertlandmarks(lua_State *L)
{
    const char *input = luaL_checkstring(L, 1);
    int encoding = luaL_checkinteger(L, 2);
    char *result = c_insertlandmarks((char *)input, encoding);
    lua_pushstring(L, result);
    return 1;
}

static int
l_listsnapshots(lua_State *L)
{
    const char *input = luaL_checkstring(L, 1);
    int encoding = luaL_checkinteger(L, 2);
    char *result = c_listsnapshots((char *)input, encoding);
    lua_pushstring(L, result);
    return 1;
}

static int
l_removesnapshots(lua_State *L)
{
    const char *input = luaL_checkstring(L, 1);
    int encoding = luaL_checkinteger(L, 2);
    char *result = c_removesnapshots((char *)input, encoding);
    lua_pushstring(L, result);
    return 1;
}

static int
l_insertsnapshots(lua_State *L)
{
    const char *input = luaL_checkstring(L, 1);
    int encoding = luaL_checkinteger(L, 2);
    char *result = c_insertsnapshots((char *)input, encoding);
    lua_pushstring(L, result);
    return 1;
}

static int
l_querypathany(lua_State *L)
{
    const char *input = luaL_checkstring(L, 1);
    int encoding = luaL_checkinteger(L, 2);
    char *result = c_querypathany((char *)input, encoding);
    lua_pushstring(L, result);
    return 1;
}

static int
l_querypathall(lua_State *L)
{
    const char *input = luaL_checkstring(L, 1);
    int encoding = luaL_checkinteger(L, 2);
    char *result = c_querypathall((char *)input, encoding);
    lua_pushstring(L, result);
    return 1;
}

static int
l_querypathordered(lua_State *L)
{
    const char *input = luaL_checkstring(L, 1);
    int encoding = luaL_checkinteger(L, 2);
    char *result = c_querypathordered((char *)input, encoding);
    lua_pushstring(L, result);
    return 1;
}

static int
l_dilate(lua_State *L)
{
    const char *input = luaL_checkstring(L, 1);
    int encoding = luaL_checkinteger(L, 2);
    char *result = c_dilate((char *)input, encoding);
    lua_pushstring(L, result);
    return 1;
}

static int
l_trackexit(lua_State *L)
{
    const char *input = luaL_checkstring(L, 1);
    int encoding = luaL_checkinteger(L, 2);
    char *result = c_trackexit((char *)input, encoding);
    lua_pushstring(L, result);
    return 1;
}

static int
l_getvariable(lua_State *L)
{
    const char *input = luaL_checkstring(L, 1);
    int encoding = luaL_checkinteger(L, 2);
    char *result = c_getvariable((char *)input, encoding);
    lua_pushstring(L, result);
    return 1;
}

static int
l_queryregionrooms(lua_State *L)
{
    const char *input = luaL_checkstring(L, 1);
    int encoding = luaL_checkinteger(L, 2);
    char *result = c_queryregionrooms((char *)input, encoding);
    lua_pushstring(L, result);
    return 1;
}

static int
l_getroom(lua_State *L)
{
    const char *input = luaL_checkstring(L, 1);
    int encoding = luaL_checkinteger(L, 2);
    char *result = c_getroom((char *)input, encoding);
    lua_pushstring(L, result);
    return 1;
}

static int
l_clearsnapshots(lua_State *L)
{
    const char *input = luaL_checkstring(L, 1);
    int encoding = luaL_checkinteger(L, 2);
    char *result = c_clearsnapshots((char *)input, encoding);
    lua_pushstring(L, result);
    return 1;
}

static int
l_takesnapshot(lua_State *L)
{
    const char *input = luaL_checkstring(L, 1);
    int encoding = luaL_checkinteger(L, 2);
    char *result = c_takesnapshot((char *)input, encoding);
    lua_pushstring(L, result);
    return 1;
}

static int
l_searchsnapshots(lua_State *L)
{
    const char *input = luaL_checkstring(L, 1);
    int encoding = luaL_checkinteger(L, 2);
    char *result = c_searchsnapshots((char *)input, encoding);
    lua_pushstring(L, result);
    return 1;
}

static int
l_searchrooms(lua_State *L)
{
    const char *input = luaL_checkstring(L, 1);
    int encoding = luaL_checkinteger(L, 2);
    char *result = c_searchrooms((char *)input, encoding);
    lua_pushstring(L, result);
    return 1;
}

static int
l_filterrooms(lua_State *L)
{
    const char *input = luaL_checkstring(L, 1);
    int encoding = luaL_checkinteger(L, 2);
    char *result = c_filterrooms((char *)input, encoding);
    lua_pushstring(L, result);
    return 1;
}

static int
l_grouproom(lua_State *L)
{
    const char *input = luaL_checkstring(L, 1);
    int encoding = luaL_checkinteger(L, 2);
    char *result = c_grouproom((char *)input, encoding);
    lua_pushstring(L, result);
    return 1;
}

static int
l_tagroom(lua_State *L)
{
    const char *input = luaL_checkstring(L, 1);
    int encoding = luaL_checkinteger(L, 2);
    char *result = c_tagroom((char *)input, encoding);
    lua_pushstring(L, result);
    return 1;
}

static int
l_setroomdata(lua_State *L)
{
    const char *input = luaL_checkstring(L, 1);
    int encoding = luaL_checkinteger(L, 2);
    char *result = c_setroomdata((char *)input, encoding);
    lua_pushstring(L, result);
    return 1;
}

static int
l_tracelocation(lua_State *L)
{
    const char *input = luaL_checkstring(L, 1);
    int encoding = luaL_checkinteger(L, 2);
    char *result = c_tracelocation((char *)input, encoding);
    lua_pushstring(L, result);
    return 1;
}

static int
l_getroomexits(lua_State *L)
{
    const char *input = luaL_checkstring(L, 1);
    int encoding = luaL_checkinteger(L, 2);
    char *result = c_getroomexits((char *)input, encoding);
    lua_pushstring(L, result);
    return 1;
}
#ifdef _WIN32
__declspec(dllexport) int luaopen_hmmlua(lua_State *L)
#else
int luaopen_hmmlua(lua_State *L)
#endif
{
#ifdef _WIN32
    HINSTANCE handle = LoadLibrary("./HellMapManager.dll");
#else
    void *handle = dlopen("./HellMapManager.so", RTLD_LAZY);
#endif
    if (!handle)
    {
        return 0;
    }
    c_version = symLoad(handle, "version");
    c_import = symLoad(handle, "import");
    c_export = symLoad(handle, "export");
    c_create = symLoad(handle, "create");
    c_close = symLoad(handle, "close");
    c_info = symLoad(handle, "info");
    c_listrooms = symLoad(handle, "listrooms");
    c_removerooms = symLoad(handle, "removerooms");
    c_insertrooms = symLoad(handle, "insertrooms");
    c_listmarkers = symLoad(handle, "listmarkers");
    c_insertmarkers = symLoad(handle, "insertmarkers");
    c_removemarkers = symLoad(handle, "removemarkers");
    c_listroutes = symLoad(handle, "listroutes");
    c_removeroutes = symLoad(handle, "removeroutes");
    c_insertroutes = symLoad(handle, "insertroutes");
    c_listtraces = symLoad(handle, "listtraces");
    c_removetraces = symLoad(handle, "removetraces");
    c_inserttraces = symLoad(handle, "inserttraces");
    c_listregions = symLoad(handle, "listregions");
    c_removeregions = symLoad(handle, "removeregions");
    c_insertregions = symLoad(handle, "insertregions");
    c_listshortcuts = symLoad(handle, "listshortcuts");
    c_removeshortcuts = symLoad(handle, "removeshortcuts");
    c_insertshortcuts = symLoad(handle, "insertshortcuts");
    c_listvariables = symLoad(handle, "listvariables");
    c_removevariables = symLoad(handle, "removevariables");
    c_insertvariables = symLoad(handle, "insertvariables");
    c_listlandmarks = symLoad(handle, "listlandmarks");
    c_removelandmarks = symLoad(handle, "removelandmarks");
    c_insertlandmarks = symLoad(handle, "insertlandmarks");
    c_listsnapshots = symLoad(handle, "listsnapshots");
    c_removesnapshots = symLoad(handle, "removesnapshots");
    c_insertsnapshots = symLoad(handle, "insertsnapshots");
    c_querypathany = symLoad(handle, "querypathany");
    c_querypathall = symLoad(handle, "querypathall");
    c_querypathordered = symLoad(handle, "querypathordered");
    c_dilate = symLoad(handle, "dilate");
    c_trackexit = symLoad(handle, "trackexit");
    c_getvariable = symLoad(handle, "getvariable");
    c_queryregionrooms = symLoad(handle, "queryregionrooms");
    c_getroom = symLoad(handle, "getroom");
    c_clearsnapshots = symLoad(handle, "clearsnapshots");
    c_takesnapshot = symLoad(handle, "takesnapshot");
    c_searchsnapshots = symLoad(handle, "searchsnapshots");
    c_searchrooms = symLoad(handle, "searchrooms");
    c_filterrooms = symLoad(handle, "filterrooms");
    c_grouproom = symLoad(handle, "grouproom");
    c_tagroom = symLoad(handle, "tagroom");
    c_setroomdata = symLoad(handle, "setroomdata");
    c_tracelocation = symLoad(handle, "tracelocation");
    c_getroomexits = symLoad(handle, "getroomexits");
    luaL_Reg functions[] = {
        {"version", l_version},
        {"import", l_import},
        {"export", l_export},
        {"create", l_create},
        {"close", l_close},
        {"info", l_info},
        {"listrooms", l_listrooms},
        {"removerooms", l_removerooms},
        {"insertrooms", l_insertrooms},
        {"listmarkers", l_listmarkers},
        {"insertmarkers", l_insertmarkers},
        {"removemarkers", l_removemarkers},
        {"listroutes", l_listroutes},
        {"removeroutes", l_removeroutes},
        {"insertroutes", l_insertroutes},
        {"listtraces", l_listtraces},
        {"removetraces", l_removetraces},
        {"inserttraces", l_inserttraces},
        {"listregions", l_listregions},
        {"removeregions", l_removeregions},
        {"insertregions", l_insertregions},
        {"listshortcuts", l_listshortcuts},
        {"removeshortcuts", l_removeshortcuts},
        {"insertshortcuts", l_insertshortcuts},
        {"listvariables", l_listvariables},
        {"removevariables", l_removevariables},
        {"insertvariables", l_insertvariables},
        {"listlandmarks", l_listlandmarks},
        {"removelandmarks", l_removelandmarks},
        {"insertlandmarks", l_insertlandmarks},
        {"listsnapshots", l_listsnapshots},
        {"removesnapshots", l_removesnapshots},
        {"insertsnapshots", l_insertsnapshots},
        {"querypathany", l_querypathany},
        {"querypathall", l_querypathall},
        {"querypathordered", l_querypathordered},
        {"dilate", l_dilate},
        {"trackexit", l_trackexit},
        {"getvariable", l_getvariable},
        {"queryregionrooms", l_queryregionrooms},
        {"getroom", l_getroom},
        {"clearsnapshots", l_clearsnapshots},
        {"takesnapshot", l_takesnapshot},
        {"searchsnapshots", l_searchsnapshots},
        {"searchrooms", l_searchrooms},
        {"filterrooms", l_filterrooms},
        {"grouproom", l_grouproom},
        {"tagroom", l_tagroom},
        {"setroomdata", l_setroomdata},
        {"tracelocation", l_tracelocation},
        {"getroomexits", l_getroomexits},
        {NULL, NULL}};
    luaL_openlib(L, "hmmlua", functions, 0);
    return 1;
}
