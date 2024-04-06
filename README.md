![portada](https://raw.githubusercontent.com/EmilioOcelotl/tres-front/main/static/img/bannerTres.png)

# Tres Estudios Abiertos

La presente investigación tiene lugar en una frontera donde el conocimiento y lo sensible se encuentran, se adscribe a la “generación de nuevos modos de performance musical y a la apertura de canales innovadores para la presentación y difusión de la investigación artística en música” (de Assis, 2018). En este sentido surge la pregunta presente en el núcleo de esta investigación: ¿Qué aportes puede realizar la escritura de código a los nuevos modos del performance audiovisual y a la escritura de un documento reflexivo que involucra materiales como sonido, gráficos y texto en el contexto de la investigación artística? La respuesta a esta pregunta parte del lenguaje de programación JavaScript.

El resultado publicado como página web se puede consultar en: [https://tres.ocelotl.cc/](https://tres.ocelotl.cc/)

Este proyecto está complementado con un [repositorio](https://github.com/EmilioOcelotl/tres-back) que gestiona el trasfondo y que imprime el resultado de esta investigación como un archivo PDF jerarquizado.

## Recursos

Este proyecto utilizó principalmente:

- [Trilium](https://github.com/zadam/trilium). Un proyecto para construir y montar una base personal de conocimiento en un servidor.

- [three.js](https://threejs.org/). Para la renderización de escenas tridimensionales en el navegador.

- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API). Para la el control del audio en el navegador.

- [Hydra](https://hydra.ojack.xyz/). Para la generación de texturas por medio de WebGL. 

- [Freesound APIv2](https://freesound.org/docs/api/). Para la búsqueda de sonidos almacenados en un lugar distinto al servidor de la página y para la búsqueda de resultados similares. Para echar a andar la API de Freesound es necesario generar un token. [Más info](https://freesound.org/docs/api/)

- [tween.js](https://tweenjs.github.io/tween.js/). Para la generación de curvas de control y para la gestión de animaciones. 

- [chiltepin](https://github.com/sptm-unam/chiltepin). Como inspiración pero también para gestionar y reflexionar sobre las expresiones regulares. 

## Requerimientos adicionales  

Es necesario tener la base de datos (db). El orden de los resultados dependerá de la jerarquía de las etiquetas. Para este caso, fue necesario implementar filtros con notas que no desparecieron del todo de la base de datos. 

También es necesario tener [credenciales de la API de FreeSound](https://freesound.org/apiv2/apply) y generar un archivo config.js dentro de src para poder utilizar la API de FreeSound. El formato del archivo es el siguiente: 

```
const apiKey = 'CLAVE_DE_API';

const userId = 'ID_DE_USUARIO';

const apiUrl = 'https://freesound.org/apiv2';

const endpoint = '/users/${userId}/sounds/';

const url = '${apiUrl}${endpoint}?token=${apiKey}';

export{apiKey, url}
```

## Ejecución

Es posible correr este proyecto con npm. 

Para instalar

`npm install`

Para correr localmente

`npm start`

Para construir

`npm build`

## Referencias

- De Assis, P. (2018). Logic of Experimentation. Leuven University Press. https://doi.org/10.2307/j.ctv6zdcpg