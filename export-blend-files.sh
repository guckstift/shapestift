#!/bin/bash

for i in blender/*.blend; do
	blender -b $i -P python/export-json.blend.py
done
